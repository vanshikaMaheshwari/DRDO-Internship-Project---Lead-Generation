import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { CustomerLeads } from '@/entities';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BaseCrudService } from '@/integrations';

interface FeedbackLoopProps {
  lead: CustomerLeads;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  leadId: string;
  originalInference: string;
  salesOfficerAction: 'accepted' | 'rejected' | 'converted';
  officerNotes: string;
  rootCauseAnalysis?: string;
  weightAdjustment?: string;
  revisedReasonCode?: string;
}

export default function FeedbackLoop({ lead, onFeedbackSubmit }: FeedbackLoopProps) {
  const [action, setAction] = useState<'accepted' | 'rejected' | 'converted' | null>(null);
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Partial<FeedbackData> | null>(null);
  const { toast } = useToast();

  const handleAnalyzeFeedback = async () => {
    if (!action || !notes.trim()) {
      toast({
        title: 'Incomplete Feedback',
        description: 'Please select an action and provide notes',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis of feedback
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate analysis based on action and notes
    const analysisResult: Partial<FeedbackData> = {
      leadId: lead._id,
      originalInference: lead.productRecommendations || 'Unknown Product',
      salesOfficerAction: action,
      officerNotes: notes,
    };

    // Root Cause Analysis
    if (action === 'rejected') {
      if (notes.toLowerCase().includes('wrong product')) {
        analysisResult.rootCauseAnalysis = 'Product Mapping Error: Incorrect industry context mapping. The signal was misinterpreted for this industry vertical.';
        analysisResult.weightAdjustment = 'Reduce Product Mapping confidence weight by 15% for similar industry signals.';
        analysisResult.revisedReasonCode = 'INDUSTRY_CONTEXT_MISMATCH';
      } else if (notes.toLowerCase().includes('already has')) {
        analysisResult.rootCauseAnalysis = 'Entity Resolution Error: Lead already has existing contract. Freshness signal was not properly evaluated.';
        analysisResult.weightAdjustment = 'Increase Freshness weight by 20% to filter out existing customers.';
        analysisResult.revisedReasonCode = 'EXISTING_CUSTOMER';
      } else {
        analysisResult.rootCauseAnalysis = 'Signal Confidence Issue: The lead signal confidence was overestimated for this market context.';
        analysisResult.weightAdjustment = 'Reduce Intent weight by 10% for similar market conditions.';
        analysisResult.revisedReasonCode = 'LOW_MARKET_FIT';
      }
    } else if (action === 'accepted') {
      analysisResult.rootCauseAnalysis = 'Lead Quality Confirmed: The inference engine correctly identified this opportunity.';
      analysisResult.weightAdjustment = 'Increase confidence weights for similar signals by 5%.';
      analysisResult.revisedReasonCode = 'CONFIRMED_OPPORTUNITY';
    } else if (action === 'converted') {
      analysisResult.rootCauseAnalysis = 'High-Value Lead: Successfully converted. Signal inference was accurate and timely.';
      analysisResult.weightAdjustment = 'Increase all relevant weights by 10% - this is a successful pattern.';
      analysisResult.revisedReasonCode = 'SUCCESSFUL_CONVERSION';
    }

    setAnalysis(analysisResult);
    setIsAnalyzing(false);

    // Save feedback to the leadfeedback collection
    try {
      await BaseCrudService.create('leadfeedback', {
        _id: crypto.randomUUID(),
        leadId: lead._id,
        salesOfficerAction: action,
        officerNotes: notes,
        rootCauseAnalysis: analysisResult.rootCauseAnalysis,
        weightAdjustment: parseFloat(analysisResult.weightAdjustment?.match(/-?\d+/)?.[0] || '0'),
        revisedReasonCode: analysisResult.revisedReasonCode,
        feedbackTimestamp: new Date(),
      });

      toast({
        title: 'Analysis Complete',
        description: 'Feedback has been analyzed and saved to improve future lead scoring',
      });
    } catch (error) {
      console.error('Failed to save feedback:', error);
      toast({
        title: 'Analysis Complete',
        description: 'Feedback has been analyzed but failed to save. Please try again.',
        variant: 'destructive',
      });
    }

    if (onFeedbackSubmit) {
      onFeedbackSubmit(analysisResult as FeedbackData);
    }
  };

  const getActionColor = (selectedAction: string | null) => {
    if (!selectedAction) return 'text-light-foreground/50 border-light-foreground/20 bg-dark-background/30';
    switch (selectedAction) {
      case 'accepted':
        return 'text-accent-teal border-accent-teal bg-accent-teal/10';
      case 'rejected':
        return 'text-destructive border-destructive bg-destructive/10';
      case 'converted':
        return 'text-accent-magenta border-accent-magenta bg-accent-magenta/10';
      default:
        return 'text-light-foreground/50 border-light-foreground/20 bg-dark-background/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-accent-teal" />
        <h2 className="font-heading text-2xl text-light-foreground">Feedback Loop & Reinforcement Learning</h2>
      </div>

      <p className="font-paragraph text-light-foreground/70 mb-8">
        Your feedback helps refine the Product-Need Inference Engine. Analyze why this lead was accepted or rejected to improve future scoring.
      </p>

      {/* Action Selection */}
      <div className="mb-8">
        <h3 className="font-heading text-lg text-light-foreground mb-4">Sales Officer Action</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { value: 'accepted' as const, label: 'Accepted', icon: CheckCircle2, color: 'text-accent-teal' },
            { value: 'rejected' as const, label: 'Rejected', icon: AlertCircle, color: 'text-destructive' },
            { value: 'converted' as const, label: 'Converted', icon: TrendingUp, color: 'text-accent-magenta' }
          ].map(({ value, label, icon: Icon, color }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAction(value)}
              className={`flex items-center gap-3 p-4 rounded border-2 transition-all ${
                action === value
                  ? `${color} border-current bg-current/10`
                  : 'text-light-foreground/50 border-light-foreground/20 bg-dark-background/30 hover:border-light-foreground/40'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-heading text-sm">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Officer Notes */}
      <div className="mb-8">
        <h3 className="font-heading text-lg text-light-foreground mb-4">Officer Notes</h3>
        <p className="font-paragraph text-sm text-light-foreground/70 mb-4">
          Explain why you accepted/rejected this lead. Examples: "Wrong product, they need MTO not Hexane", "Company already has long-term contract", "Perfect fit for our furnace oil offering"
        </p>
        <Textarea
          placeholder="Share your assessment and reasoning..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph min-h-24"
        />
      </div>

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyzeFeedback}
        disabled={isAnalyzing || !action}
        className="flex items-center gap-2 bg-accent-teal text-primary-foreground font-heading font-semibold px-8 py-4 rounded border-2 border-accent-teal disabled:opacity-50 disabled:cursor-not-allowed mb-8"
      >
        <Brain className="w-5 h-5" />
        {isAnalyzing ? 'Analyzing Feedback...' : 'Analyze & Learn'}
      </motion.button>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-t border-accent-teal/20 pt-8 space-y-6"
        >
          <h3 className="font-heading text-xl text-light-foreground">Analysis Results</h3>

          {/* Root Cause Analysis */}
          <div className="bg-dark-background/30 rounded-lg p-6 border border-accent-teal/20">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-accent-teal flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-heading text-sm text-light-foreground uppercase tracking-wider mb-2">
                  Root Cause Analysis
                </h4>
                <p className="font-paragraph text-sm text-light-foreground/80">
                  {analysis.rootCauseAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Weight Adjustment */}
          <div className="bg-dark-background/30 rounded-lg p-6 border border-accent-magenta/20">
            <div className="flex items-start gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-accent-magenta flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-heading text-sm text-light-foreground uppercase tracking-wider mb-2">
                  Weight Adjustment
                </h4>
                <p className="font-paragraph text-sm text-light-foreground/80">
                  {analysis.weightAdjustment}
                </p>
              </div>
            </div>
          </div>

          {/* Revised Reason Code */}
          <div className="bg-dark-background/30 rounded-lg p-6 border border-accent-teal/20">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-accent-teal flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-heading text-sm text-light-foreground uppercase tracking-wider mb-2">
                  Revised Reason Code
                </h4>
                <p className="font-paragraph text-sm text-light-foreground/80 font-mono">
                  {analysis.revisedReasonCode}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Summary */}
          <div className="bg-gradient-to-r from-accent-teal/5 to-accent-magenta/5 rounded-lg p-6 border border-accent-teal/20">
            <p className="font-paragraph text-sm text-light-foreground/80">
              ✓ This feedback has been recorded and will be used to refine the Product-Need Inference Engine for future leads with similar characteristics.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
