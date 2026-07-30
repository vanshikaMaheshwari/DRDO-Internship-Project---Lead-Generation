import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Building2, Star } from 'lucide-react';
import { CustomerLeads } from '@/entities';

interface CompanyCardProps {
  lead: CustomerLeads;
  onClick?: () => void;
}

export default function CompanyCard({ lead, onClick }: CompanyCardProps) {
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

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-light-foreground/50';
    if (score >= 80) return 'text-accent-teal';
    if (score >= 60) return 'text-accent-magenta';
    return 'text-muted-gray';
  };

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: '#00FFFF' }}
      className="bg-dark-background/50 backdrop-blur-sm border border-muted-gray/30 rounded-lg p-6 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-accent-teal/10 rounded border border-accent-teal/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-accent-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg text-light-foreground truncate">
              {lead.companyName || 'Unnamed Company'}
            </h3>
            <p className="font-paragraph text-sm text-light-foreground/70 truncate">
              {lead.industryType || 'Unknown Industry'}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded border font-paragraph text-xs uppercase tracking-wider whitespace-nowrap ${getStatusColor(lead.status)}`}>
          {lead.status || 'Unknown'}
        </span>
      </div>

      {/* Facility Locations */}
      {lead.plantLocations && (
        <div className="mb-4 pb-4 border-b border-muted-gray/20">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent-teal flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider mb-1">
                Facility Locations
              </p>
              <p className="font-paragraph text-sm text-light-foreground line-clamp-2">
                {lead.plantLocations}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      {lead.contactInformation && (
        <div className="mb-4 pb-4 border-b border-muted-gray/20">
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-accent-magenta flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider mb-1">
                Contact
              </p>
              <p className="font-paragraph text-sm text-light-foreground truncate">
                {lead.contactInformation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Recommendations */}
      {lead.productRecommendations && (
        <div className="mb-4 pb-4 border-b border-muted-gray/20">
          <p className="font-paragraph text-xs text-light-foreground/70 uppercase tracking-wider mb-2">
            Recommended Products
          </p>
          <p className="font-paragraph text-sm text-light-foreground/80 line-clamp-2">
            {lead.productRecommendations}
          </p>
        </div>
      )}

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-accent-teal/5 border border-accent-teal/20 rounded p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 text-accent-teal" />
            <span className="font-paragraph text-xs text-light-foreground/70">Trust Score</span>
          </div>
          <div className={`font-heading text-lg ${getScoreColor(lead.trustScore)}`}>
            {lead.trustScore || 0}
          </div>
        </div>

        <div className="bg-muted-gray/5 border border-muted-gray/20 rounded p-3">
          <div className="flex items-center gap-1 mb-1">
            <Building2 className="w-3 h-3 text-muted-gray" />
            <span className="font-paragraph text-xs text-light-foreground/70">Status</span>
          </div>
          <div className="font-heading text-lg text-light-foreground/70">
            {lead.status?.charAt(0).toUpperCase() || '—'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
