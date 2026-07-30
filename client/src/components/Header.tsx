import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/states', label: 'States' },
    { path: '/leads', label: 'Leads' },
    { path: '/create-lead', label: 'Create Lead' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/sources', label: 'Sources' },
    { path: '/feedback', label: 'Feedback' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-background/80 backdrop-blur-lg border-b border-accent-teal/20">
      <nav className="max-w-[100rem] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent-teal/10 rounded border border-accent-teal/30 flex items-center justify-center group-hover:bg-accent-teal/20 transition-colors">
              <Zap className="w-6 h-6 text-accent-teal" />
            </div>
            <span className="font-heading text-xl text-light-foreground">
              The Square <span className="text-accent-teal">Lead</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span className={`font-paragraph text-sm tracking-wider transition-colors ${
                  isActive(link.path) ? 'text-accent-teal' : 'text-light-foreground/70 hover:text-light-foreground'
                }`}>
                  {link.label}
                </span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent-teal"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center border border-accent-teal/30 rounded text-accent-teal hover:bg-accent-teal/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-6 pt-6 border-t border-accent-teal/20"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-sm tracking-wider py-2 transition-colors ${
                    isActive(link.path) ? 'text-accent-teal' : 'text-light-foreground/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
