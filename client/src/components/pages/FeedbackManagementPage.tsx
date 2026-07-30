import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Filter, Download, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

interface FeedbackRecord {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  leadId?: string;
  salesOfficerAction?: string;
  officerNotes?: string;
  rootCauseAnalysis?: string;
  weightAdjustment?: number;
  revisedReasonCode?: string;
  feedbackTimestamp?: Date | string;
}

export default function FeedbackManagementPage() {
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    converted: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<FeedbackRecord>('leadfeedback', [], { limit: 100 });
      setFeedbackRecords(result.items || []);
      
      // Calculate stats
      const total = result.items?.length || 0;
      const accepted = result.items?.filter(f => f.salesOfficerAction === 'accepted').length || 0;
      const rejected = result.items?.filter(f => f.salesOfficerAction === 'rejected').length || 0;
      const converted = result.items?.filter(f => f.salesOfficerAction === 'converted').length || 0;
      
      setStats({ total, accepted, rejected, converted });
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feedback records',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = filterAction === 'all' 
    ? feedbackRecords 
    : feedbackRecords.filter(f => f.salesOfficerAction === filterAction);

  const getActionColor = (action?: string) => {
    switch (action?.toLowerCase()) {
      case 'accepted':
        return 'text-accent-teal border-accent-teal bg-accent-teal/10';
      case 'rejected':
        return 'text-destructive border-destructive bg-destructive/10';
      case 'converted':
        return 'text-accent-magenta border-accent-magenta bg-accent-magenta/10';
      default:
        return 'text-light-foreground border-light-foreground/30 bg-light-foreground/5';
    }
  };

  const getActionIcon = (action?: string) => {
    switch (action?.toLowerCase()) {
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'converted':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const exportFeedbackData = () => {
    const csvContent = [
      ['Lead ID', 'Action', 'Officer Notes', 'Root Cause', 'Weight Adjustment', 'Reason Code', 'Timestamp'],
      ...filteredRecords.map(f => [
        f.leadId || '',
        f.salesOfficerAction || '',
        f.officerNotes || '',
        f.rootCauseAnalysis || '',
        f.weightAdjustment || '',
        f.revisedReasonCode || '',
        f.feedbackTimestamp ? new Date(f.feedbackTimestamp).toISOString() : '',
      ])
    ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Export Successful',
      description: `Exported ${filteredRecords.length} feedback records`,
    });
  };

  return (
    <div className="min-h-screen bg-dark-background text-light-foreground">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-accent-teal" />
            <h1 className="font-heading text-5xl text-light-foreground">Feedback Management</h1>
          </div>
          <p className="font-paragraph text-lg text-light-foreground/70">
            Track and analyze sales officer feedback to refine your lead scoring model
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">Total Feedback</span>
              <BarChart3 className="w-5 h-5 text-accent-teal" />
            </div>
            <div className="font-heading text-4xl text-light-foreground">{stats.total}</div>
          </div>

          <div className="bg-dark-background/50 backdrop-blur-sm border border-accent-teal/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">Accepted</span>
              <CheckCircle2 className="w-5 h-5 text-accent-teal" />
            </div>
            <div className="font-heading text-4xl text-accent-teal">{stats.accepted}</div>
          </div>

          <div className="bg-dark-background/50 backdrop-blur-sm border border-destructive/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">Rejected</span>
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="font-heading text-4xl text-destructive">{stats.rejected}</div>
          </div>

          <div className="bg-dark-background/50 backdrop-blur-sm border border-accent-magenta/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">Converted</span>
              <TrendingUp className="w-5 h-5 text-accent-magenta" />
            </div>
            <div className="font-heading text-4xl text-accent-magenta">{stats.converted}</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-accent-teal" />
            <div className="flex flex-col gap-2">
              <label className="font-paragraph text-sm text-light-foreground/70">Filter by Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-dark-background border border-accent-teal/30 text-light-foreground rounded px-4 py-2 font-paragraph text-sm"
              >
                <option value="all">All Actions</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadFeedback}
              className="flex items-center gap-2 bg-accent-teal/10 text-accent-teal font-paragraph px-6 py-3 rounded border border-accent-teal/30 hover:bg-accent-teal/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportFeedbackData}
              className="flex items-center gap-2 bg-accent-magenta/10 text-accent-magenta font-paragraph px-6 py-3 rounded border border-accent-magenta/30 hover:bg-accent-magenta/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Feedback Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-8">
              <BarChart3 className="w-16 h-16 text-muted-gray mb-6" />
              <h3 className="font-heading text-2xl text-light-foreground mb-3">No Feedback Records</h3>
              <p className="font-paragraph text-light-foreground/70 text-center">
                No feedback records found. Sales officers can provide feedback from lead detail pages.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted-gray/30 bg-dark-background/30">
                    <th className="px-6 py-4 text-left font-heading text-sm text-light-foreground/70 uppercase tracking-wider">Lead ID</th>
                    <th className="px-6 py-4 text-left font-heading text-sm text-light-foreground/70 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left font-heading text-sm text-light-foreground/70 uppercase tracking-wider">Officer Notes</th>
                    <th className="px-6 py-4 text-left font-heading text-sm text-light-foreground/70 uppercase tracking-wider">Root Cause</th>
                    <th className="px-6 py-4 text-left font-heading text-sm text-light-foreground/70 uppercase tracking-wider">Reason Code</th>
                    <th className="px-6 py-4 text-left font-heading text-sm text-light-foreground/70 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-muted-gray/20 hover:bg-dark-background/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-paragraph text-sm text-light-foreground">
                        {record.leadId || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded border font-paragraph text-xs uppercase tracking-wider ${getActionColor(record.salesOfficerAction)}`}>
                          {getActionIcon(record.salesOfficerAction)}
                          {record.salesOfficerAction || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-paragraph text-sm text-light-foreground/80 max-w-xs truncate">
                        {record.officerNotes || '-'}
                      </td>
                      <td className="px-6 py-4 font-paragraph text-sm text-light-foreground/80 max-w-xs truncate">
                        {record.rootCauseAnalysis || '-'}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-accent-teal">
                        {record.revisedReasonCode || '-'}
                      </td>
                      <td className="px-6 py-4 font-paragraph text-sm text-light-foreground/70">
                        {record.feedbackTimestamp 
                          ? new Date(record.feedbackTimestamp).toLocaleDateString() 
                          : '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-dark-background/50 backdrop-blur-sm border border-accent-teal/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-accent-teal" />
              <h3 className="font-heading text-2xl text-light-foreground">Model Improvement Insights</h3>
            </div>
            <div className="space-y-4 font-paragraph text-light-foreground/80">
              <p>
                ✓ {stats.total} total feedback records collected
              </p>
              <p>
                ✓ {stats.accepted} leads confirmed as quality opportunities
              </p>
              <p>
                ✓ {stats.rejected} false positives identified for model refinement
              </p>
              <p>
                ✓ {stats.converted} successful conversions tracked
              </p>
              <p className="pt-4 border-t border-accent-teal/20">
                Use this feedback data to retrain your lead scoring model and reduce false positives in future predictions.
              </p>
            </div>
          </div>

          <div className="bg-dark-background/50 backdrop-blur-sm border border-accent-magenta/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-accent-magenta" />
              <h3 className="font-heading text-2xl text-light-foreground">Key Metrics</h3>
            </div>
            <div className="space-y-4 font-paragraph text-light-foreground/80">
              <div className="flex justify-between items-center">
                <span>Acceptance Rate:</span>
                <span className="font-heading text-xl text-accent-teal">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rejection Rate:</span>
                <span className="font-heading text-xl text-destructive">
                  {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Conversion Rate:</span>
                <span className="font-heading text-xl text-accent-magenta">
                  {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="pt-4 border-t border-accent-magenta/20">
                <p className="text-sm">
                  Monitor these metrics to evaluate the effectiveness of your lead scoring model over time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
