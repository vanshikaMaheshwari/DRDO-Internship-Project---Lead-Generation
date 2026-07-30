import { motion } from 'framer-motion';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { CustomerLeads } from '@/entities';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppOutreachProps {
  lead: CustomerLeads;
}

export default function WhatsAppOutreach({ lead }: WhatsAppOutreachProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate WhatsApp message based on lead data
  const generateWhatsAppMessage = () => {
    const urgency = (lead.trustScore || 0) > 75 ? 'High' : (lead.trustScore || 0) > 50 ? 'Medium' : 'Low';
    const confidenceScore = lead.trustScore || 0;
    
    return `🚨 NEW LIVE LEAD

Target: ${lead.companyName || 'Company Name'}
Need: ${lead.productRecommendations || 'Product TBD'} (Source: ${lead.sourceName || 'Manual entry'})

Urgency: ${urgency}
Trust Score: ${confidenceScore}%

Dossier Link: [Lead Details Available in System]
Next Best Action: ${lead.status?.toLowerCase() === 'hot' ? 'Schedule immediate site visit' : 'Initial outreach call'}

Industry: ${lead.industryType || 'N/A'}
Location: ${lead.plantLocations || 'N/A'}
Contact: ${lead.contactInformation || 'N/A'}`;
  };

  const whatsappMessage = generateWhatsAppMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'WhatsApp message copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-accent-teal/5 to-accent-magenta/5 border border-accent-teal/20 rounded-lg p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-accent-teal" />
        <h2 className="font-heading text-2xl text-light-foreground">WhatsApp Outreach Alert</h2>
      </div>

      <p className="font-paragraph text-light-foreground/70 mb-6">
        Policy-compliant WhatsApp message for Sales Officer. Copy and send directly to your team.
      </p>

      {/* Message Preview */}
      <div className="bg-dark-background/50 border border-accent-teal/20 rounded-lg p-6 mb-6 font-paragraph text-sm text-light-foreground whitespace-pre-wrap leading-relaxed">
        {whatsappMessage}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 bg-accent-teal/10 text-accent-teal font-heading font-semibold px-6 py-3 rounded border border-accent-teal/30 hover:bg-accent-teal/20 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Message
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendWhatsApp}
          className="flex items-center gap-2 bg-accent-teal text-primary-foreground font-heading font-semibold px-6 py-3 rounded border-2 border-accent-teal"
        >
          <MessageCircle className="w-4 h-4" />
          Send via WhatsApp
        </motion.button>
      </div>

      {/* Message Components Breakdown */}
      <div className="mt-8 pt-8 border-t border-accent-teal/20">
        <h3 className="font-heading text-lg text-light-foreground mb-4">Message Components</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-dark-background/30 rounded p-4">
            <span className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider">Company</span>
            <p className="font-paragraph text-sm text-light-foreground mt-2">{lead.companyName || 'N/A'}</p>
          </div>
          <div className="bg-dark-background/30 rounded p-4">
            <span className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider">Product</span>
            <p className="font-paragraph text-sm text-light-foreground mt-2">{lead.productRecommendations || 'N/A'}</p>
          </div>
          <div className="bg-dark-background/30 rounded p-4">
            <span className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider">Confidence Score</span>
            <p className="font-paragraph text-sm text-accent-teal mt-2">{lead.trustScore || 0}%</p>
          </div>
          <div className="bg-dark-background/30 rounded p-4">
            <span className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider">Urgency</span>
            <p className="font-paragraph text-sm text-accent-magenta mt-2">
              {(lead.trustScore || 0) > 75 ? 'High' : (lead.trustScore || 0) > 50 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
