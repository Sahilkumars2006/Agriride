import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Heart, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-agri-forest text-white pt-16 pb-12 border-t border-[#235840]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Banner */}
        <div className="bg-[#1e583f] rounded-2xl p-6 sm:p-8 mb-12 border border-[#2b6e51] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-agri-gold/20 flex items-center justify-center text-agri-gold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-base">Verified Equipment</h4>
              <p className="text-agri-border text-xs mt-0.5">Every machine inspected for mechanical fitness and genuine ownership documents.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-agri-leaf/20 flex items-center justify-center text-agri-leaf shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-base">Zero Middleman Markup</h4>
              <p className="text-agri-border text-xs mt-0.5">Direct peer-to-peer farmer pricing with transparent hourly and daily calculations.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-base">Dedicated Kisan Helpline</h4>
              <p className="text-agri-border text-xs mt-0.5">Multilingual on-call booking assistance and conflict resolution support.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#235840]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-agri-forest shadow-md">
                <Tractor className="w-6 h-6 text-agri-forest" />
              </div>
              <span className="text-2xl font-bold font-heading text-white tracking-tight">
                Agri<span className="text-agri-gold">Ride</span>
              </span>
            </Link>
            <p className="text-agri-border/80 text-sm max-w-sm leading-relaxed">
              Empowering Indian farmers through on-demand, affordable agricultural machinery rental.
              Rent smart, minimize debt, and maximize crop yields without high capital investment.
            </p>
            <div className="pt-2 text-xs text-agri-border/60">
              Tagline: <span className="text-agri-gold font-medium italic">"Rent Smarter. Farm Better."</span>
            </div>
          </div>

          {/* For Farmers */}
          <div>
            <h5 className="font-heading font-semibold text-white text-sm mb-4 tracking-wider uppercase">
              For Farmers
            </h5>
            <ul className="space-y-2.5 text-sm text-agri-border/80">
              <li>
                <Link to="/marketplace" className="hover:text-agri-gold transition-colors">
                  Browse Equipment
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=tractors" className="hover:text-agri-gold transition-colors">
                  Hire Heavy Tractors
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=drones" className="hover:text-agri-gold transition-colors">
                  Precision Spray Drones
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=harvesters" className="hover:text-agri-gold transition-colors">
                  Combine Harvesters
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-agri-gold transition-colors">
                  Rental Process Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* For Machinery Owners */}
          <div>
            <h5 className="font-heading font-semibold text-white text-sm mb-4 tracking-wider uppercase">
              Equipment Owners
            </h5>
            <ul className="space-y-2.5 text-sm text-agri-border/80">
              <li>
                <Link to="/about" className="hover:text-agri-gold transition-colors">
                  List Your Tractor
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-agri-gold transition-colors">
                  Fleet Monetization
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-agri-gold transition-colors">
                  Damage Protection & KYC
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-agri-gold transition-colors">
                  Availability Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Support */}
          <div>
            <h5 className="font-heading font-semibold text-white text-sm mb-4 tracking-wider uppercase">
              Project & Contact
            </h5>
            <ul className="space-y-2.5 text-sm text-agri-border/80">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-agri-gold shrink-0" />
                <span className="text-xs">Punjab, Haryana, MH, KA, UP</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-agri-gold shrink-0" />
                <span className="text-xs">1800-AGRI-RIDE (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-agri-gold shrink-0" />
                <span className="text-xs">support@agriride.org</span>
              </li>
              <li className="pt-2">
                <Link to="/about" className="text-xs text-agri-gold underline hover:text-white transition-colors">
                  Project Documentation & Architecture
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-agri-border/60">
          <div>
            &copy; {new Date().getFullYear()} AgriRide Marketplace. Full-Stack Engineering Capstone Project.
          </div>
          <div className="flex items-center gap-6">
            <span>Built with React, Vite, Tailwind CSS, Django REST Framework & PostgreSQL</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
