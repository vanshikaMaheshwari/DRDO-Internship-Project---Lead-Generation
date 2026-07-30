import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, TrendingDown, Building2, MapPin, Star, Grid3x3, List, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CustomerLeads } from '@/entities';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CompanyCard from '@/components/CompanyCard';

export default function LeadsPage() {
  const [searchParams] = useSearchParams();
  const stateFilter = searchParams.get('state');
  
  const [leads, setLeads] = useState<CustomerLeads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('trust');
  const [hasNext, setHasNext] = useState(false);
  const [nextSkip, setNextSkip] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async (skip = 0) => {
    try {
      const result = await BaseCrudService.getAll<CustomerLeads>('leads', [], { limit: 50, skip });
      setLeads(prev => skip === 0 ? result.items : [...prev, ...result.items]);
      setHasNext(result.hasNext);
      setNextSkip(result.nextSkip);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load leads:', error);
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (nextSkip !== null) {
      loadLeads(nextSkip);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'hot':
        return 'text-accent-teal border-accent-teal bg-accent-teal/10';
      case 'warm':
        return 'text-accent-magenta border-accent-magenta bg-accent-magenta/10';
      case 'cold':
        return 'text-muted-gray border-muted-gray bg-muted-gray/10';
      default:
        return 'text-light-foreground border-light-foreground/30 bg-light-foreground/5';
    }
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.industryType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesState = !stateFilter || lead.plantLocations?.includes(stateFilter);
      return matchesSearch && matchesStatus && matchesState;
    })
    .sort((a, b) => {
      if (sortBy === 'trust') {
        return (b.trustScore || 0) - (a.trustScore || 0);
      } else if (sortBy === 'date') {
        return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
      }
      return 0;
    });

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
            {stateFilter && (
              <Link to="/states">
                <motion.button
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-2 text-accent-teal font-paragraph text-sm hover:text-accent-teal/80 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to States
                </motion.button>
              </Link>
            )}
            <h1 className="font-heading text-5xl lg:text-6xl text-light-foreground mb-4">
              Lead <span className="text-accent-teal">Discovery</span>
            </h1>
            <p className="font-paragraph text-lg text-light-foreground/70 max-w-3xl">
              {stateFilter ? `Leads in ${stateFilter}` : 'Browse and filter discovered leads with intelligent scoring and geographic routing'}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Total Leads', value: filteredLeads.length.toString(), icon: Building2 },
              { label: 'Hot Leads', value: filteredLeads.filter(l => l.status?.toLowerCase() === 'hot').length.toString(), icon: TrendingUp },
              { label: 'Avg Trust Score', value: (filteredLeads.reduce((acc, l) => acc + (l.trustScore || 0), 0) / filteredLeads.length || 0).toFixed(1), icon: Star },
              { label: 'Conversion Rate', value: '34.2%', icon: TrendingDown }
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

      {/* Filters */}
      <section className="w-full max-w-[100rem] mx-auto px-8 py-8 border-b border-accent-teal/20">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-teal" />
            <Input
              type="text"
              placeholder="Search by company name or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph h-12"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph h-12">
              <Filter className="w-4 h-4 mr-2 text-accent-teal" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-dark-background border-accent-teal/30">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-dark-background border-accent-teal/30">
              <SelectItem value="trust">Trust Score</SelectItem>
              <SelectItem value="date">Last Updated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-dark-background/50 border border-accent-teal/30 rounded p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-accent-teal/20 text-accent-teal' : 'text-light-foreground/70 hover:text-light-foreground'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-accent-teal/20 text-accent-teal' : 'text-light-foreground/70 hover:text-light-foreground'}`}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Leads Grid/List */}
      <section className="w-full max-w-[100rem] mx-auto px-8 py-12 min-h-[600px]">
        {isLoading ? null : filteredLeads.length > 0 ? (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeads.map((lead, idx) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Link to={`/leads/${lead._id}`}>
                      <CompanyCard lead={lead} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredLeads.map((lead, idx) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Link to={`/leads/${lead._id}`}>
                      <motion.div
                        whileHover={{ x: 8, borderColor: '#00FFFF' }}
                        className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-6 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-heading text-xl text-light-foreground mb-2">
                                  {lead.companyName || 'Unnamed Company'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  <span className="font-paragraph text-light-foreground/70">
                                    {lead.industryType || 'Unknown Industry'}
                                  </span>
                                  {lead.plantLocations && (
                                    <span className="flex items-center gap-2 font-paragraph text-light-foreground/70">
                                      <MapPin className="w-4 h-4 text-accent-teal" />
                                      {lead.plantLocations}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded border font-paragraph text-xs uppercase tracking-wider whitespace-nowrap ${getStatusColor(lead.status)}`}>
                                {lead.status || 'Unknown'}
                              </span>
                            </div>

                            {lead.productRecommendations && (
                              <p className="font-paragraph text-sm text-light-foreground/70 line-clamp-2">
                                {lead.productRecommendations}
                              </p>
                            )}
                          </div>

                          <div className="flex lg:flex-col items-center lg:items-end gap-6 lg:gap-4">
                            <div className="text-center lg:text-right">
                              <div className="font-paragraph text-xs text-light-foreground/70 mb-1">Trust Score</div>
                              <div className="font-heading text-3xl text-accent-teal">{lead.trustScore || 0}</div>
                            </div>
                            <div className="text-center lg:text-right">
                              <div className="font-paragraph text-xs text-light-foreground/70 mb-1">Trust Score</div>
                              <div className="font-heading text-3xl text-accent-magenta">{lead.trustScore || 0}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {hasNext && (
              <div className="flex justify-center pt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMore}
                  className="bg-transparent text-accent-teal font-heading font-medium px-8 py-4 rounded border-2 border-accent-teal"
                >
                  Load More Leads
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <Building2 className="w-16 h-16 text-muted-gray mb-6" />
            <h3 className="font-heading text-2xl text-light-foreground mb-3">No Leads Found</h3>
            <p className="font-paragraph text-light-foreground/70">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No leads have been discovered yet'}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
