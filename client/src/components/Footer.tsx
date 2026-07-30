import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-dark-background border-t border-accent-teal/20">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-teal/10 rounded border border-accent-teal/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-teal" />
              </div>
              <span className="font-heading text-xl text-light-foreground">
                Intelligence<span className="text-accent-teal">Hub</span>
              </span>
            </div>
            <p className="font-paragraph text-sm text-light-foreground/70 leading-relaxed">
              Precision engineering for web intelligence. Transform complex data into actionable insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-light-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { path: '/leads', label: 'Leads' },
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/sources', label: 'Sources' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-paragraph text-sm text-light-foreground/70 hover:text-accent-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg text-light-foreground mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@intelligencehub.com"
                  className="font-paragraph text-sm text-light-foreground/70 hover:text-accent-teal transition-colors"
                >
                  contact@intelligencehub.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="font-paragraph text-sm text-light-foreground/70 hover:text-accent-teal transition-colors"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                <span className="font-paragraph text-sm text-light-foreground/70">
                  Mumbai, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-lg text-light-foreground mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <span className="font-paragraph text-sm text-light-foreground/70">Privacy Policy</span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-light-foreground/70">Terms of Service</span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-light-foreground/70">Data Governance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-accent-teal/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-paragraph text-sm text-light-foreground/70">
              © {currentYear} IntelligenceHub. All rights reserved.
            </p>
            <p className="font-paragraph text-sm text-light-foreground/70">
              Policy-safe web intelligence platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
