import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component - Production-quality footer
 * 
 * Features:
 * - Multi-column layout
 * - Social links
 * - Contact information
 * - Consistent with design system
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-primary-400 transition">
              <Heart className="w-8 h-8 fill-current text-primary-500" />
              <span className="text-xl font-bold">Sankalp Setu</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Bridging generosity and impact. Every meal matters, every donation counts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary-400 transition">How It Works</Link>
              </li>
              <li>
                <Link to="/ngo-directory" className="hover:text-primary-400 transition">NGO Directory</Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register?role=donor" className="hover:text-primary-400 transition">Become a Donor</Link>
              </li>
              <li>
                <Link to="/register?role=ngo" className="hover:text-primary-400 transition">Register as NGO</Link>
              </li>
              <li>
                <Link to="/register?role=volunteer" className="hover:text-primary-400 transition">Volunteer</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@sankalpsetu.org" className="hover:text-primary-400 transition">
                  support@sankalpsetu.org
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-primary-400 transition">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {currentYear} Sankalp Setu. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-400 transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
