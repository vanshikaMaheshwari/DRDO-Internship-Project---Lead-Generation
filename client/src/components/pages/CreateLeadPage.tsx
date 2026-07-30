import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLeadCreation } from '@/hooks/use-lead-creation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function CreateLeadPage() {
  const { createLead, isCreating, error } = useLeadCreation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    industryType: '',
    plantLocations: '',
    contactInformation: '',
    trustScore: '50',
    status: 'cold',
    productRecommendations: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableNotification: true,
    officerPhone: '+1234567890', // Default phone - should be configurable
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    // Validate required fields
    if (!formData.companyName.trim()) {
      toast({
        title: 'Error',
        description: 'Company name is required',
      });
      return;
    }

    try {
      const newLead = await createLead(
        {
          companyName: formData.companyName,
          industryType: formData.industryType,
          plantLocations: formData.plantLocations,
          contactInformation: formData.contactInformation,
          trustScore: parseInt(formData.trustScore),
          status: formData.status,
          productRecommendations: formData.productRecommendations,
          lastUpdated: new Date(),
        },
        {
          notifyOfficer: notificationSettings.enableNotification,
          officerPhone: notificationSettings.officerPhone,
        }
      );

      if (newLead) {
        setSuccessMessage(
          `Lead "${newLead.companyName}" created successfully!${
            notificationSettings.enableNotification
              ? ' WhatsApp notification sent to sales officer.'
              : ''
          }`
        );

        // Reset form
        setFormData({
          companyName: '',
          industryType: '',
          plantLocations: '',
          contactInformation: '',
          trustScore: '50',
          status: 'cold',
          productRecommendations: '',
        });

        toast({
          title: 'Success',
          description: 'Lead created and notification sent!',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'Failed to create lead',
      });
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
              Create New <span className="text-accent-teal">Lead</span>
            </h1>
            <p className="font-paragraph text-lg text-light-foreground/70 max-w-3xl">
              Add a new lead to the system and automatically notify your sales officer via WhatsApp
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="w-full max-w-[100rem] mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-dark-background/50 backdrop-blur-sm border border-accent-teal/20 rounded-lg p-8"
        >
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-accent-teal/10 border border-accent-teal/30 rounded-lg flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-accent-teal flex-shrink-0 mt-0.5" />
              <p className="font-paragraph text-light-foreground">{successMessage}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="font-paragraph text-light-foreground">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="font-heading text-2xl text-light-foreground mb-6">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph"
                    required
                  />
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Industry Type
                  </label>
                  <Input
                    type="text"
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleInputChange}
                    placeholder="e.g., Manufacturing, Energy"
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph"
                  />
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Plant Locations
                  </label>
                  <Input
                    type="text"
                    name="plantLocations"
                    value={formData.plantLocations}
                    onChange={handleInputChange}
                    placeholder="e.g., Maharashtra, Gujarat"
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph"
                  />
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Contact Information
                  </label>
                  <Input
                    type="text"
                    name="contactInformation"
                    value={formData.contactInformation}
                    onChange={handleInputChange}
                    placeholder="e.g., contact@company.com"
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph"
                  />
                </div>
              </div>
            </div>

            {/* Trust Scoring */}
            <div>
              <h2 className="font-heading text-2xl text-light-foreground mb-6">Trust Scoring</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Trust Score (0-100)
                  </label>
                  <Input
                    type="number"
                    name="trustScore"
                    value={formData.trustScore}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph"
                  />
                </div>

                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Status
                  </label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-background border-accent-teal/30">
                      <SelectItem value="cold">Cold</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product & Reason */}
            <div>
              <h2 className="font-heading text-2xl text-light-foreground mb-6">Product & Reason</h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                    Product Recommendations
                  </label>
                  <Textarea
                    name="productRecommendations"
                    value={formData.productRecommendations}
                    onChange={handleInputChange}
                    placeholder="Describe recommended products..."
                    className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph min-h-24"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-accent-teal/5 border border-accent-teal/20 rounded-lg p-6">
              <h2 className="font-heading text-2xl text-light-foreground mb-6">WhatsApp Notification</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.enableNotification}
                    onChange={(e) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        enableNotification: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-accent-teal/30 bg-dark-background/50"
                  />
                  <span className="font-paragraph text-light-foreground">
                    Send WhatsApp notification to sales officer
                  </span>
                </label>

                {notificationSettings.enableNotification && (
                  <div>
                    <label className="block font-paragraph text-sm text-light-foreground/70 mb-2">
                      Sales Officer Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={notificationSettings.officerPhone}
                      onChange={(e) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          officerPhone: e.target.value,
                        }))
                      }
                      placeholder="+1234567890"
                      className="bg-dark-background/50 border-accent-teal/30 text-light-foreground font-paragraph"
                    />
                    <p className="font-paragraph text-xs text-light-foreground/50 mt-2">
                      Format: +[country code][phone number]
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-2 bg-accent-teal text-primary-foreground font-heading font-semibold px-8 py-4 rounded border-2 border-accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Create Lead & Notify
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
