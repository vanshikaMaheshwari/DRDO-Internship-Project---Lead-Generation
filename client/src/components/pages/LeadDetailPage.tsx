import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, MapPin, Phone, Mail, Star, TrendingUp, CheckCircle, XCircle, Clock, Send, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CustomerLeads } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import WhatsAppOutreach from '@/components/WhatsAppOutreach';
import FeedbackLoop from '@/components/FeedbackLoop';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<CustomerLeads | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      const data = await BaseCrudService.getById<CustomerLeads>('leads', id!);
      setLead(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load lead:', error);
      setIsLoading(false);
    }
  };

  const handleFeedback = async (accepted: boolean) => {
    if (!lead) return;

    const newStatus = accepted ? 'Accepted' : 'Rejected';
    setLead({ ...lead, status: newStatus });

    try {
      await BaseCrudService.update<CustomerLeads>('leads', {
        _id: lead._id,
        status: newStatus
      });

      toast({
        title: accepted ? 'Lead Accepted' : 'Lead Rejected',
        description: `Lead has been marked as ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error('Failed to update lead:', error);
      loadLead();
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive',
      });
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: 'Empty Feedback',
        description: 'Please enter feedback before sending',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingFeedback(true);
    try {
      // Simulate sending feedback (in production, this would save to a feedback collection)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFeedback('');
      toast({
        title: 'Feedback Sent',
        description: 'Your feedback has been recorded and will help improve our scoring model',
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to send feedback',
        variant: 'destructive',
      });
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'hot':
      case 'accepted':
        return 'text-accent-teal border-accent-teal bg-accent-teal/10';
      case 'warm':
        return 'text-accent-magenta border-accent-magenta bg-accent-magenta/10';
      case 'cold':
      case 'rejected':
        return 'text-muted-gray border-muted-gray bg-muted-gray/10';
      default:
        return 'text-light-foreground border-light-foreground/30 bg-light-foreground/5';
    }
  };

  return (
    <div className="min-h-screen bg-dark-background text-light-foreground">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 py-12 min-h-[600px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : !lead ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Building2 className="w-16 h-16 text-muted-gray mb-6" />
            <h3 className="font-heading text-2xl text-light-foreground mb-3">Lead Not Found</h3>
            <p className="font-paragraph text-light-foreground/70 mb-8">
              The lead you're looking for doesn't exist
            </p>
            <Link to="/leads">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent-teal text-primary-foreground font-heading font-semibold px-8 py-4 rounded border-2 border-accent-teal"
              >
                Back to Leads
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Back Button */}
            <Link to="/leads">
              <motion.button
                whileHover={{ x: -4 }}
                className="flex items-center gap-2 text-accent-teal font-paragraph text-sm hover:text-accent-teal/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Leads
              </motion.button>
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-dark-background/50 backdrop-blur-sm border border-accent-teal/20 rounded-lg p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-accent-teal/10 rounded border border-accent-teal/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-accent-teal" />
                    </div>
                    <div>
                      <h1 className="font-heading text-4xl text-light-foreground mb-2">
                        {lead.companyName || 'Unnamed Company'}
                      </h1>
                      <p className="font-paragraph text-lg text-light-foreground/70">
                        {lead.industryType || 'Unknown Industry'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4">
                  <span className={`px-4 py-2 rounded border font-paragraph text-sm uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                    {lead.status || 'Unknown'}
                  </span>
                  {lead.lastUpdated && (
                    <div className="flex items-center gap-2 font-paragraph text-sm text-light-foreground/70">
                      <Clock className="w-4 h-4" />
                      {new Date(lead.lastUpdated).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-accent-teal/5 border border-accent-teal/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-accent-teal" />
                    <span className="font-paragraph text-sm text-light-foreground/70">Trust Score</span>
                  </div>
                  <div className="font-heading text-5xl text-accent-teal">{lead.trustScore || 0}</div>
                </div>

                <div className="bg-accent-magenta/5 border border-accent-magenta/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-accent-magenta" />
                    <span className="font-paragraph text-sm text-light-foreground/70">Live Source</span>
                  </div>
                  <div className="font-heading text-lg text-accent-magenta truncate">{lead.sourceName || 'Manual entry'}</div>
                </div>
              </div>
            </motion.div>

            {/* Details Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Company Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8 space-y-6"
              >
                <h2 className="font-heading text-2xl text-light-foreground mb-6">Company Information</h2>

                {lead.plantLocations && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-accent-teal" />
                      <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">
                        Plant Locations
                      </span>
                    </div>
                    <p className="font-paragraph text-base text-light-foreground pl-7">
                      {lead.plantLocations}
                    </p>
                  </div>
                )}

                {lead.contactInformation && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-5 h-5 text-accent-teal" />
                      <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">
                        Contact Information
                      </span>
                    </div>
                    <p className="font-paragraph text-base text-light-foreground pl-7">
                      {lead.contactInformation}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Product Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8 space-y-6"
              >
                <h2 className="font-heading text-2xl text-light-foreground mb-6">Product Recommendations</h2>

                {lead.productRecommendations && (
                  <div className="space-y-4">
                    <p className="font-paragraph text-base text-light-foreground leading-relaxed">
                      {lead.productRecommendations}
                    </p>
                  </div>
                )}

                {lead.sourceName && (
                  <div className="pt-6 border-t border-accent-teal/20">
                    <div className="mb-3">
                      <span className="font-paragraph text-sm text-light-foreground/70 uppercase tracking-wider">
                        Live Source
                      </span>
                    </div>
                    <p className="font-paragraph text-sm text-light-foreground/80 leading-relaxed">
                      Scraped from {lead.sourceName}
                      {lead.lastUpdated && ` · last updated ${new Date(lead.lastUpdated).toLocaleDateString()}`}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Feedback Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-accent-teal/5 to-accent-magenta/5 border border-accent-teal/20 rounded-lg p-8"
            >
              <h2 className="font-heading text-2xl text-light-foreground mb-6">Sales Officer Feedback</h2>
              <p className="font-paragraph text-light-foreground/70 mb-8">
                Mark this lead as accepted or rejected to help refine the scoring model
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeedback(true)}
                  disabled={lead.status?.toLowerCase() === 'accepted'}
                  className="flex items-center gap-3 bg-accent-teal text-primary-foreground font-heading font-semibold px-8 py-4 rounded border-2 border-accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Lead
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeedback(false)}
                  disabled={lead.status?.toLowerCase() === 'rejected'}
                  className="flex items-center gap-3 bg-transparent text-destructive font-heading font-medium px-8 py-4 rounded border-2 border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Lead
                </motion.button>
              </div>

              {/* Detailed Feedback Form */}
              <div className="border-t border-accent-teal/20 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-accent-teal" />
                  <h3 className="font-heading text-lg text-light-foreground">Detailed Feedback</h3>
                </div>
                <p className="font-paragraph text-sm text-light-foreground/70 mb-4">
                  Share additional insights about this lead to help improve our AI model
                </p>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's your assessment of this lead? Any concerns or opportunities?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph min-h-24"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendFeedback}
                    disabled={isSendingFeedback || !feedback.trim()}
                    className="flex items-center gap-2 bg-accent-teal text-primary-foreground font-heading font-semibold px-6 py-3 rounded border-2 border-accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingFeedback ? 'Sending...' : 'Send Feedback'}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp Outreach */}
            <WhatsAppOutreach lead={lead} />

            {/* Feedback Loop */}
            <FeedbackLoop lead={lead} />

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
            >
              <h2 className="font-heading text-2xl text-light-foreground mb-6">Quick Actions</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 bg-accent-teal/10 text-accent-teal font-paragraph px-6 py-4 rounded border border-accent-teal/30"
                >
                  <Phone className="w-5 h-5" />
                  Call Lead
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 bg-accent-teal/10 text-accent-teal font-paragraph px-6 py-4 rounded border border-accent-teal/30"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 bg-accent-teal/10 text-accent-teal font-paragraph px-6 py-4 rounded border border-accent-teal/30"
                >
                  <Clock className="w-5 h-5" />
                  Schedule Meeting
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
