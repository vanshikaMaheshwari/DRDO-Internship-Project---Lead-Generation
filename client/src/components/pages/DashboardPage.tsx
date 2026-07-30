import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, MapPin, Award, Activity, Zap, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CustomerLeads, RegionalOffices } from '@/entities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';

export default function DashboardPage() {
  const [leads, setLeads] = useState<CustomerLeads[]>([]);
  const [offices, setOffices] = useState<RegionalOffices[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leadsResult, officesResult] = await Promise.all([
        BaseCrudService.getAll<CustomerLeads>('leads', [], { limit: 1000 }),
        BaseCrudService.getAll<RegionalOffices>('regionaloffices', [], { limit: 100 })
      ]);
      setLeads(leadsResult.items);
      setOffices(officesResult.items);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status?.toLowerCase() === 'hot').length;
  const acceptedLeads = leads.filter(l => l.status?.toLowerCase() === 'accepted').length;
  const conversionRate = totalLeads > 0 ? ((acceptedLeads / totalLeads) * 100).toFixed(1) : '0.0';
  const avgTrustScore = totalLeads > 0 ? (leads.reduce((acc, l) => acc + (l.trustScore || 0), 0) / totalLeads).toFixed(1) : '0.0';

  // Status distribution
  const statusData = [
    { name: 'Hot', value: leads.filter(l => l.status?.toLowerCase() === 'hot').length, color: '#00FFFF' },
    { name: 'Warm', value: leads.filter(l => l.status?.toLowerCase() === 'warm').length, color: '#FF00FF' },
    { name: 'Cold', value: leads.filter(l => l.status?.toLowerCase() === 'cold').length, color: '#4A4A4A' },
    { name: 'Accepted', value: acceptedLeads, color: '#00FFFF' },
    { name: 'Rejected', value: leads.filter(l => l.status?.toLowerCase() === 'rejected').length, color: '#FF4136' }
  ].filter(item => item.value > 0);

  // Industry distribution
  const industryMap = new Map<string, number>();
  leads.forEach(lead => {
    const industry = lead.industryType || 'Unknown';
    industryMap.set(industry, (industryMap.get(industry) || 0) + 1);
  });
  const industryData = Array.from(industryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Score distribution
  const scoreRanges = [
    { range: '0-20', count: 0 },
    { range: '21-40', count: 0 },
    { range: '41-60', count: 0 },
    { range: '61-80', count: 0 },
    { range: '81-100', count: 0 }
  ];
  leads.forEach(lead => {
    const score = lead.trustScore || 0;
    if (score <= 20) scoreRanges[0].count++;
    else if (score <= 40) scoreRanges[1].count++;
    else if (score <= 60) scoreRanges[2].count++;
    else if (score <= 80) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });

  // Regional distribution - include all states
  const regionMap = new Map<string, number>();
  offices.forEach(office => {
    const region = office.stateProvince || 'Unknown';
    const officeLeads = leads.filter(lead => 
      lead.plantLocations?.toLowerCase().includes(region.toLowerCase())
    ).length;
    regionMap.set(region, officeLeads);
  });
  const regionData = Array.from(regionMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Trust score vs data freshness scatter plot
  const scatterData = leads.slice(0, 50).map(lead => {
    const daysSinceUpdate = lead.lastUpdated
      ? Math.round((Date.now() - new Date(lead.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    return {
      daysSinceUpdate: daysSinceUpdate ?? 0,
      trustScore: lead.trustScore || 0,
      company: lead.companyName || 'Unknown'
    };
  });

  return (
    <div className="min-h-screen bg-dark-background text-light-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full max-w-[100rem] mx-auto px-8 py-16 border-b border-accent-teal/20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-magenta/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl lg:text-6xl text-light-foreground mb-4">
              Executive <span className="text-accent-teal">Dashboard</span>
            </h1>
            <p className="font-paragraph text-lg text-light-foreground/70 max-w-3xl">
              Monitor conversion funnels, geographic heatmaps, and performance metrics in real-time
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="w-full max-w-[100rem] mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: 'Total Leads', value: totalLeads.toString(), icon: Users, color: 'accent-teal' },
            { label: 'Hot Leads', value: hotLeads.toString(), icon: TrendingUp, color: 'accent-teal' },
            { label: 'Accepted', value: acceptedLeads.toString(), icon: Target, color: 'accent-teal' },
            { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Activity, color: 'accent-magenta' },
            { label: 'Avg Trust Score', value: avgTrustScore, icon: Award, color: 'accent-magenta' },
            { label: 'Regional Offices', value: offices.length.toString(), icon: MapPin, color: 'accent-magenta' }
          ].map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-dark-background/50 backdrop-blur-sm border border-accent-teal/20 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <metric.icon className={`w-5 h-5 text-${metric.color}`} />
                <span className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
              <div className={`font-heading text-3xl text-${metric.color}`}>{metric.value}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts Grid */}
      <section className="w-full max-w-[100rem] mx-auto px-8 pb-12 space-y-8">
        {/* Status Distribution & Industry Distribution */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
          >
            <h2 className="font-heading text-2xl text-light-foreground mb-6">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid #00FFFF33',
                    borderRadius: '8px',
                    fontFamily: 'azeret-mono'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
          >
            <h2 className="font-heading text-2xl text-light-foreground mb-6">Top Industries</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={industryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
                <XAxis
                  dataKey="name"
                  stroke="#E0E0E0"
                  tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#E0E0E0"
                  tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid #00FFFF33',
                    borderRadius: '8px',
                    fontFamily: 'azeret-mono'
                  }}
                />
                <Bar dataKey="value" fill="#00FFFF" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
        >
          <h2 className="font-heading text-2xl text-light-foreground mb-6">Trust Score Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
              <XAxis
                dataKey="range"
                stroke="#E0E0E0"
                tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
              />
              <YAxis
                stroke="#E0E0E0"
                tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A2E',
                  border: '1px solid #00FFFF33',
                  borderRadius: '8px',
                  fontFamily: 'azeret-mono'
                }}
              />
              <Bar dataKey="count" fill="#FF00FF" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Regional Distribution */}
        {regionData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
          >
            <h2 className="font-heading text-2xl text-light-foreground mb-6">Geographic Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
                <XAxis
                  dataKey="name"
                  stroke="#E0E0E0"
                  tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#E0E0E0"
                  tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid #00FFFF33',
                    borderRadius: '8px',
                    fontFamily: 'azeret-mono'
                  }}
                />
                <Bar dataKey="value" fill="#00FFFF" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-accent-teal/5 to-accent-magenta/5 border border-accent-teal/20 rounded-lg p-8"
        >
          <h2 className="font-heading text-2xl text-light-foreground mb-8">Conversion Funnel</h2>
          
          <div className="space-y-6">
            {[
              { stage: 'Discovered', count: totalLeads, percentage: 100 },
              { stage: 'Hot Leads', count: hotLeads, percentage: totalLeads > 0 ? (hotLeads / totalLeads) * 100 : 0 },
              { stage: 'Accepted', count: acceptedLeads, percentage: totalLeads > 0 ? (acceptedLeads / totalLeads) * 100 : 0 }
            ].map((stage, idx) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg text-light-foreground">{stage.stage}</span>
                  <span className="font-paragraph text-sm text-light-foreground/70">
                    {stage.count} ({stage.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted-gray/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                    className="h-full bg-gradient-to-r from-accent-teal to-accent-magenta rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lead Quality Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
        >
          <h2 className="font-heading text-2xl text-light-foreground mb-6">Trust vs. Freshness Matrix</h2>
          <p className="font-paragraph text-light-foreground/70 mb-6">Trust Score vs. Days Since Last Scrape</p>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
              <XAxis
                type="number"
                dataKey="daysSinceUpdate"
                name="Days Since Update"
                stroke="#E0E0E0"
                tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
              />
              <YAxis
                type="number"
                dataKey="trustScore"
                name="Trust Score"
                stroke="#E0E0E0"
                tick={{ fill: '#E0E0E0', fontSize: 12, fontFamily: 'azeret-mono' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A2E',
                  border: '1px solid #00FFFF33',
                  borderRadius: '8px',
                  fontFamily: 'azeret-mono'
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter
                name="Leads"
                data={scatterData}
                fill="#00FFFF"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-accent-teal" />
            <h2 className="font-heading text-2xl text-light-foreground">Top Opportunities</h2>
          </div>
          
          <div className="space-y-4">
            {leads
              .filter(l => l.trustScore && l.trustScore >= 70)
              .sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0))
              .slice(0, 5)
              .map((lead, idx) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-accent-teal/5 border border-accent-teal/20 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-heading text-lg text-light-foreground">{lead.companyName}</h3>
                    <p className="font-paragraph text-sm text-light-foreground/70">{lead.industryType}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-paragraph text-xs text-light-foreground/70">Trust</div>
                      <div className="font-heading text-2xl text-accent-teal">{lead.trustScore}</div>
                    </div>
                    <div className="w-12 h-12 bg-accent-teal/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-accent-teal" />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
