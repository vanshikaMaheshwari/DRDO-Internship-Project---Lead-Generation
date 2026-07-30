import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CustomerLeads } from '@/entities';

interface StateData {
  state: string;
  count: number;
  hotLeads: number;
  avgScore: number;
}

export default function StatesPage() {
  const [states, setStates] = useState<StateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const result = await BaseCrudService.getAll<CustomerLeads>('leads', [], { limit: 1000 });
      
      // Group leads by state from plantLocations
      const stateMap = new Map<string, CustomerLeads[]>();
      
      result.items.forEach(lead => {
        if (lead.plantLocations) {
          // Extract state from plantLocations (assuming format like "State, City" or just "State")
          const parts = lead.plantLocations.split(',').map(p => p.trim());
          const state = parts[parts.length - 1]; // Get the last part as state
          
          if (!stateMap.has(state)) {
            stateMap.set(state, []);
          }
          stateMap.get(state)!.push(lead);
        }
      });

      // Convert to StateData array
      const statesData: StateData[] = Array.from(stateMap.entries()).map(([state, leads]) => ({
        state,
        count: leads.length,
        hotLeads: leads.filter(l => l.status?.toLowerCase() === 'hot').length,
        avgScore: leads.reduce((acc, l) => acc + (l.trustScore || 0), 0) / leads.length || 0
      })).sort((a, b) => b.count - a.count);

      setStates(statesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load states:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-background text-light-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full max-w-[100rem] mx-auto px-8 py-16 border-b border-accent-teal/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl lg:text-6xl text-light-foreground mb-4">
              Leads by <span className="text-accent-teal">State</span>
            </h1>
            <p className="font-paragraph text-lg text-light-foreground/70 max-w-3xl">
              Browse leads organized by geographic regions. Click on any state to view all leads in that region.
            </p>
          </motion.div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {[
              { label: 'Total States', value: states.length.toString(), icon: MapPin },
              { label: 'Total Leads', value: states.reduce((acc, s) => acc + s.count, 0).toString(), icon: Building2 },
              { label: 'Hot Leads', value: states.reduce((acc, s) => acc + s.hotLeads, 0).toString(), icon: TrendingUp }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-dark-background/50 backdrop-blur-sm border border-accent-teal/20 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className="w-5 h-5 text-accent-teal" />
                  <span className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div className="font-heading text-3xl text-light-foreground">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="w-full max-w-[100rem] mx-auto px-8 py-12 min-h-[600px]">
        {isLoading ? null : states.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map((state, idx) => (
              <motion.div
                key={state.state}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link to={`/leads?state=${encodeURIComponent(state.state)}`}>
                  <motion.div
                    whileHover={{ y: -8, borderColor: '#00FFFF' }}
                    className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8 h-full transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-accent-teal/10 rounded border border-accent-teal/30 flex items-center justify-center group-hover:bg-accent-teal/20 transition-colors">
                        <MapPin className="w-6 h-6 text-accent-teal" />
                      </div>
                      <span className="px-3 py-1 rounded bg-accent-teal/10 text-accent-teal border border-accent-teal/30 font-paragraph text-xs uppercase tracking-wider">
                        {state.count} leads
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl text-light-foreground mb-6 group-hover:text-accent-teal transition-colors">
                      {state.state}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-sm text-light-foreground/70">Hot Leads</span>
                        <span className="font-heading text-lg text-accent-teal">{state.hotLeads}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-sm text-light-foreground/70">Avg Trust</span>
                        <span className="font-heading text-lg text-accent-magenta">{state.avgScore.toFixed(1)}</span>
                      </div>
                      <div className="w-full h-1 bg-muted-gray/20 rounded-full overflow-hidden mt-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(state.avgScore / 100) * 100}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
                          className="h-full bg-gradient-to-r from-accent-teal to-accent-magenta"
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <MapPin className="w-16 h-16 text-muted-gray mb-6" />
            <h3 className="font-heading text-2xl text-light-foreground mb-3">No States Found</h3>
            <p className="font-paragraph text-light-foreground/70">
              No leads with location data available yet
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
