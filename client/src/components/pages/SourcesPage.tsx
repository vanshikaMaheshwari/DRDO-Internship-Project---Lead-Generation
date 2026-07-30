import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Database, ExternalLink, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Sources } from '@/entities';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SourcesPage() {
  const [sources, setSources] = useState<Sources[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [nextSkip, setNextSkip] = useState<number | null>(null);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async (skip = 0) => {
    try {
      const result = await BaseCrudService.getAll<Sources>('sources', [], { limit: 50, skip });
      setSources(prev => skip === 0 ? result.items : [...prev, ...result.items]);
      setHasNext(result.hasNext);
      setNextSkip(result.nextSkip);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load sources:', error);
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (nextSkip !== null) {
      loadSources(nextSkip);
    }
  };

  const getTrustScoreColor = (score?: number) => {
    if (!score) return 'text-muted-gray';
    if (score >= 80) return 'text-accent-teal';
    if (score >= 60) return 'text-accent-magenta';
    return 'text-muted-gray';
  };

  const filteredSources = sources
    .filter(source => {
      const matchesSearch = searchTerm === '' || 
        source.sourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || source.sourceType?.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && source.isActive) ||
        (statusFilter === 'inactive' && !source.isActive);
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));

  const activeSources = sources.filter(s => s.isActive).length;
  const avgTrustScore = sources.length > 0 
    ? (sources.reduce((acc, s) => acc + (s.trustScore || 0), 0) / sources.length).toFixed(1)
    : '0.0';

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
              Source <span className="text-accent-teal">Registry</span>
            </h1>
            <p className="font-paragraph text-lg text-light-foreground/70 max-w-3xl">
              Track domains, RSS feeds, and public tender sites with trust scores and policy-safe monitoring
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Total Sources', value: sources.length.toString(), icon: Database },
              { label: 'Active Sources', value: activeSources.toString(), icon: CheckCircle },
              { label: 'Avg Trust Score', value: avgTrustScore, icon: TrendingUp },
              { label: 'Source Types', value: new Set(sources.map(s => s.sourceType)).size.toString(), icon: Database }
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
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-teal" />
            <Input
              type="text"
              placeholder="Search by source name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph h-12"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-48 bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph h-12">
              <SelectValue placeholder="Source Type" />
            </SelectTrigger>
            <SelectContent className="bg-dark-background border-accent-teal/30">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="domain">Domain</SelectItem>
              <SelectItem value="rss">RSS Feed</SelectItem>
              <SelectItem value="tender">Tender Site</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-dark-background border-accent-teal/30">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Sources List */}
      <section className="w-full max-w-[100rem] mx-auto px-8 py-12 min-h-[600px]">
        {isLoading ? null : filteredSources.length > 0 ? (
          <div className="space-y-6">
            {filteredSources.map((source, idx) => (
              <motion.div
                key={source._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-6 hover:border-accent-teal/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl text-light-foreground">
                            {source.sourceName || 'Unnamed Source'}
                          </h3>
                          {source.isActive ? (
                            <span className="flex items-center gap-1 px-2 py-1 rounded border border-accent-teal/30 bg-accent-teal/10 text-accent-teal font-paragraph text-xs">
                              <CheckCircle className="w-3 h-3" />
                              ACTIVE
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-1 rounded border border-muted-gray/30 bg-muted-gray/10 text-muted-gray font-paragraph text-xs">
                              <XCircle className="w-3 h-3" />
                              INACTIVE
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <span className="px-3 py-1 rounded border border-accent-magenta/30 bg-accent-magenta/10 text-accent-magenta font-paragraph text-xs uppercase tracking-wider">
                            {source.sourceType || 'Unknown'}
                          </span>
                          {source.lastCrawled && (
                            <span className="flex items-center gap-2 font-paragraph text-sm text-light-foreground/70">
                              <Clock className="w-4 h-4" />
                              Last crawled: {new Date(source.lastCrawled).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {source.description && (
                          <p className="font-paragraph text-sm text-light-foreground/70 leading-relaxed">
                            {source.description}
                          </p>
                        )}

                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-paragraph text-sm text-accent-teal hover:text-accent-teal/80 transition-colors mt-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {source.url}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center lg:items-end gap-4">
                    <div className="text-center lg:text-right">
                      <div className="font-paragraph text-xs text-light-foreground/70 mb-1 uppercase tracking-wider">
                        Trust Score
                      </div>
                      <div className={`font-heading text-4xl ${getTrustScoreColor(source.trustScore)}`}>
                        {source.trustScore || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {hasNext && (
              <div className="flex justify-center pt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMore}
                  className="bg-transparent text-accent-teal font-heading font-medium px-8 py-4 rounded border-2 border-accent-teal"
                >
                  Load More Sources
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <Database className="w-16 h-16 text-muted-gray mb-6" />
            <h3 className="font-heading text-2xl text-light-foreground mb-3">No Sources Found</h3>
            <p className="font-paragraph text-light-foreground/70">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No sources have been registered yet'}
            </p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="w-full max-w-[100rem] mx-auto px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-accent-teal/5 to-accent-magenta/5 border border-accent-teal/20 rounded-lg p-8"
        >
          <h2 className="font-heading text-2xl text-light-foreground mb-6">Policy-Safe Monitoring</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-heading text-lg text-accent-teal mb-3">Robots.txt Compliance</h3>
              <p className="font-paragraph text-sm text-light-foreground/70 leading-relaxed">
                All crawlers respect robots.txt directives and rate limits to ensure ethical data collection
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg text-accent-teal mb-3">Official APIs</h3>
              <p className="font-paragraph text-sm text-light-foreground/70 leading-relaxed">
                Prioritize official APIs and authorized data sources for maximum reliability
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg text-accent-teal mb-3">Audit Trails</h3>
              <p className="font-paragraph text-sm text-light-foreground/70 leading-relaxed">
                Complete logging of source, timestamp, and data lineage for full auditability
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
