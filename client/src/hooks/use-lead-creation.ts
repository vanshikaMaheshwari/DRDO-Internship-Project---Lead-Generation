import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { CustomerLeads } from '@/entities';
import { notifySalesOfficer } from '@/services/whatsapp-service';

interface CreateLeadOptions {
  notifyOfficer?: boolean;
  officerPhone?: string;
  baseUrl?: string;
}

/**
 * Hook for creating leads with automatic WhatsApp notifications
 */
export function useLeadCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLead = async (
    leadData: Omit<CustomerLeads, '_id' | '_createdDate' | '_updatedDate'>,
    options: CreateLeadOptions = {}
  ): Promise<CustomerLeads | null> => {
    setIsCreating(true);
    setError(null);

    try {
      // Generate unique ID for the lead
      const leadId = crypto.randomUUID();
      
      // Create the lead in the database
      const newLead: CustomerLeads = {
        _id: leadId,
        ...leadData,
      };

      await BaseCrudService.create('leads', newLead);

      // Trigger WhatsApp notification if enabled
      if (options.notifyOfficer && options.officerPhone) {
        const baseUrl = options.baseUrl || window.location.origin;
        const leadUrl = `${baseUrl}/leads/${leadId}`;
        
        // Send notification asynchronously (don't block lead creation)
        notifySalesOfficer(newLead, options.officerPhone, leadUrl).catch(err => {
          console.error('Failed to send WhatsApp notification:', err);
        });
      }

      setIsCreating(false);
      return newLead;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lead';
      setError(errorMessage);
      setIsCreating(false);
      return null;
    }
  };

  return {
    createLead,
    isCreating,
    error,
  };
}
