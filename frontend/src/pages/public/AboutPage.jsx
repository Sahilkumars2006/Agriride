import React from 'react';
import { 
  Tractor, 
  Target, 
  Eye, 
  Lightbulb, 
  CheckCircle2, 
  Layers, 
  Database, 
  ShieldCheck, 
  Users, 
  Leaf, 
  Cpu
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const AboutPage = () => {
  return (
    <div className="bg-agri-bg pb-20 space-y-16">
      
      {/* Header Banner */}
      <section className="bg-agri-forest text-white py-16 px-4 sm:px-6 lg:px-8 hero-pattern">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge variant="gold" className="text-xs uppercase font-bold tracking-wider">
            About AgriRide
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading">
            Engineering a Smarter, Fairer Agricultural Economy
          </h1>
          <p className="text-sm sm:text-base text-agri-border/90 max-w-2xl mx-auto leading-relaxed">
            AgriRide is an end-to-end full-stack digital marketplace designed to democratize farm mechanization for Indian agriculture by eliminating the capital barrier to high-performance machinery.
          </p>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Problem Statement Card */}
          <div className="bg-white p-8 rounded-3xl border border-agri-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF0F0] text-[#B83232] flex items-center justify-center font-bold text-lg">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold font-heading text-agri-text">
              The Agricultural Problem
            </h2>
            <p className="text-xs sm:text-sm text-agri-muted leading-relaxed">
              In India, over 86% of farmers operate marginal and small land holdings of less than 2 hectares. High upfront capital costs (ranging from ₹6 Lakhs for basic tractors to ₹25 Lakhs for combine harvesters) force farmers into crippling informal debt.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-agri-text pt-2">
              <li className="flex items-start gap-2">
                <span className="text-agri-danger font-bold">•</span>
                <span>Prohibitive machinery purchase costs & high interest rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agri-danger font-bold">•</span>
                <span>Tractors remaining idle for 7–8 months per year with owner depreciation losses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agri-danger font-bold">•</span>
                <span>Informal brokers taking up to 30% cut without service guarantees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agri-danger font-bold">•</span>
                <span>Lack of real-time visibility into local machinery availability.</span>
              </li>
            </ul>
          </div>

          {/* AgriRide Proposed Solution Card */}
          <div className="bg-white p-8 rounded-3xl border border-agri-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-agri-lightgreen text-agri-forest flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <h2 className="text-2xl font-bold font-heading text-agri-forest">
              The AgriRide Solution
            </h2>
            <p className="text-xs sm:text-sm text-agri-muted leading-relaxed">
              AgriRide introduces an on-demand, peer-to-peer equipment sharing economy. Farmers can rent high-tech machinery calibrated to their specific crop schedule, while machine owners turn idle machinery downtime into steady monthly revenue.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-agri-text pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                <span>Transparent hourly and daily pricing with automated price engines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                <span>Verified equipment condition, driver inclusion, and damage protection.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                <span>Zero middlemen — direct booking handshake between farmers & fleet owners.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                <span>Access to modern drone sprayers and precision laser land levellers.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-agri-forest text-white p-8 sm:p-10 rounded-3xl space-y-4 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-agri-gold/20 text-agri-gold flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">Our Mission</h3>
            <p className="text-xs sm:text-sm text-agri-border/90 leading-relaxed">
              To empower every Indian farmer with instantaneous, affordable access to modern agricultural machinery, optimizing input costs, improving soil productivity, and eliminating machinery debt.
            </p>
          </div>

          <div className="bg-[#1e583f] text-white p-8 sm:p-10 rounded-3xl space-y-4 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">Our Vision</h3>
            <p className="text-xs sm:text-sm text-agri-border/90 leading-relaxed">
              To establish India's most trusted, digitally integrated rural equipment network where smart farming technology is accessible to all, irrespective of landholding size or economic background.
            </p>
          </div>

        </div>
      </section>

      {/* Technical Architecture Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-agri-border shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="primary">Full-Stack Architecture</Badge>
            <h2 className="text-3xl font-extrabold font-heading text-agri-text">
              System Engineering & Technology Stack
            </h2>
            <p className="text-xs sm:text-sm text-agri-muted">
              Built with industry-standard web engineering frameworks for speed, security, and presentation reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-agri-bg border border-agri-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-agri-forest text-white flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-agri-forest">
                Frontend Layer
              </h4>
              <p className="text-xs text-agri-muted leading-relaxed">
                React 18 Single Page Application bundled with Vite for ultra-fast HMR. Styled with Tailwind CSS using custom agricultural design tokens, Lucide icons, and Recharts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-agri-bg border border-agri-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-agri-leaf text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-agri-forest">
                Backend Services
              </h4>
              <p className="text-xs text-agri-muted leading-relaxed">
                Python Django & Django REST Framework (DRF) with Simple JWT authentication, custom role-based permissions (`FARMER`, `OWNER`, `ADMIN`), and server-side pricing engines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-agri-bg border border-agri-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-agri-gold text-agri-forest flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-agri-forest">
                Persistence & Storage
              </h4>
              <p className="text-xs text-agri-muted leading-relaxed">
                PostgreSQL relational database with foreign key integrity, transactional locking to prevent overlapping machinery bookings, and Cloudinary media hosting.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
