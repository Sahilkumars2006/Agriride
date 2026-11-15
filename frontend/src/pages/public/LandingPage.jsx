import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tractor, 
  Search, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ChevronRight,
  Layers,
  Wheat,
  Droplets,
  Compass
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { MOCK_EQUIPMENT } from '../../data/mockEquipment';
import { EquipmentCard } from '../../components/marketplace/EquipmentCard';
import { Badge } from '../../components/common/Badge';

export const LandingPage = ({ onSelectEquipment, onOpenAuth }) => {
  const navigate = useNavigate();
  const [heroSearchCategory, setHeroSearchCategory] = useState('all');
  const [heroSearchState, setHeroSearchState] = useState('All States');

  const featuredList = MOCK_EQUIPMENT.filter(eq => eq.featured);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearchCategory !== 'all') params.append('category', heroSearchCategory);
    if (heroSearchState !== 'All States') params.append('state', heroSearchState);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-agri-forest text-white pt-16 pb-24 md:pt-20 md:pb-32 hero-pattern">
        
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-agri-leaf/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-agri-gold/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-agri-gold">
                <Sparkles className="w-4 h-4 text-agri-gold" />
                <span>Next-Gen AgTech Equipment Marketplace</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-[1.12]">
                The Right Equipment. <br />
                <span className="text-agri-gold">At the Right Time.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-agri-border/90 max-w-2xl leading-relaxed font-normal">
                Access modern agricultural machinery without the burden of expensive ownership. Discover, compare, and rent verified tractors, harvesters, and spray drones from trusted owners near you.
              </p>

              {/* Direct CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/marketplace"
                  className="px-8 py-3.5 rounded-xl bg-agri-gold text-agri-text font-heading font-bold text-base shadow-lg hover:bg-[#edd085] hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <span>Explore Equipment</span>
                  <ArrowRight className="w-5 h-5 text-agri-text" />
                </Link>

                <button
                  onClick={() => onOpenAuth ? onOpenAuth('owner') : null}
                  className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-semibold text-base border border-white/20 backdrop-blur-sm transition-all"
                >
                  List Your Machinery
                </button>
              </div>

              {/* Hero Stats Pill */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    500+
                  </div>
                  <div className="text-xs text-agri-border/80 mt-0.5">Verified Machines</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-agri-gold font-heading">
                    65%
                  </div>
                  <div className="text-xs text-agri-border/80 mt-0.5">Average Cost Savings</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    100%
                  </div>
                  <div className="text-xs text-agri-border/80 mt-0.5">Transparent Rates</div>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Visual with border glow */}
                <div className="rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative aspect-[4/3] bg-black/40">
                  <img
                    src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"
                    alt="Indian Farmer with modern tractor in green fields"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Testimonial Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-agri-border shadow-lg text-agri-text">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-agri-lightgreen flex items-center justify-center text-agri-forest font-bold shrink-0">
                        🚜
                      </div>
                      <div className="text-left text-xs">
                        <div className="font-bold text-agri-forest">Mahindra Novo 755 DI (74 HP)</div>
                        <div className="text-agri-muted">Rented in Ludhiana • ₹450/hr with Driver</div>
                      </div>
                      <div className="ml-auto text-right">
                        <Badge variant="success" className="text-[10px]">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Trust Badge */}
                <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-xl border border-agri-border flex items-center gap-2.5 text-agri-text">
                  <ShieldCheck className="w-7 h-7 text-agri-leaf" />
                  <div className="text-left">
                    <span className="block text-xs font-bold text-agri-forest">Zero Ownership Debt</span>
                    <span className="block text-[10px] text-agri-muted">Pay only when you operate</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Quick Search Bar Card floating over Hero */}
          <div className="mt-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-agri-border text-agri-text">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Category */}
              <div className="md:col-span-4 text-left">
                <label className="text-xs font-bold uppercase text-agri-muted tracking-wider block mb-1">
                  Machine Type
                </label>
                <div className="relative">
                  <select
                    value={heroSearchCategory}
                    onChange={(e) => setHeroSearchCategory(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm font-semibold rounded-xl border border-agri-border bg-agri-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 text-agri-text"
                  >
                    <option value="all">All Farm Machinery</option>
                    <option value="tractors">Tractors (35 HP – 75 HP)</option>
                    <option value="harvesters">Combine Harvesters</option>
                    <option value="drones">Agricultural Drones</option>
                    <option value="tillage">Tillage & Rotavators</option>
                    <option value="sowing">Seed Drills & Planters</option>
                    <option value="sprayers">Crop Sprayers</option>
                  </select>
                </div>
              </div>

              {/* State */}
              <div className="md:col-span-4 text-left">
                <label className="text-xs font-bold uppercase text-agri-muted tracking-wider block mb-1">
                  Location / State
                </label>
                <div className="relative">
                  <select
                    value={heroSearchState}
                    onChange={(e) => setHeroSearchState(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm font-semibold rounded-xl border border-agri-border bg-agri-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 text-agri-text"
                  >
                    <option value="All States">All Farming Hubs</option>
                    <option value="Punjab">Punjab (Ludhiana, Amritsar)</option>
                    <option value="Haryana">Haryana (Karnal, Kurukshetra)</option>
                    <option value="Maharashtra">Maharashtra (Nashik, Pune)</option>
                    <option value="Karnataka">Karnataka (Belagavi, Hubli)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (Varanasi, Meerut)</option>
                    <option value="Telangana">Telangana (Warangal, Nizamabad)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-4 flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-agri-forest text-white font-heading font-bold text-sm shadow-md hover:bg-[#123e2a] hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-agri-gold" />
                  <span>Find Available Machinery</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* 2. POPULAR CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="gold" className="uppercase font-semibold tracking-wider text-xs">
            Comprehensive Inventory
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-agri-text">
            Explore Equipment by Category
          </h2>
          <p className="text-sm sm:text-base text-agri-muted">
            From heavy-duty multi-crop combine harvesters to high-precision agricultural drones, find the exact machinery calibrated for your crop season.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/marketplace?category=${cat.id}`}
              className="group bg-white p-5 rounded-2xl border border-agri-border hover:border-agri-forest/40 shadow-card hover:shadow-card-hover transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-agri-lightgreen text-agri-forest flex items-center justify-center group-hover:bg-agri-forest group-hover:text-agri-gold transition-colors duration-300 mb-3 shadow-sm">
                <Tractor className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text group-hover:text-agri-forest transition-colors mb-1">
                {cat.name}
              </h3>
              <span className="text-xs text-agri-muted font-medium">
                {cat.count} listings
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EQUIPMENT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="primary" className="mb-2 uppercase tracking-wider text-xs">
              Prime Machinery
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-agri-text">
              Featured Machinery Near You
            </h2>
            <p className="text-sm text-agri-muted mt-1">
              Top-rated equipment inspected for reliability and immediate field deployment.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1 text-sm font-bold text-agri-forest hover:text-agri-leaf transition-colors"
          >
            <span>View All Equipment</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.map((eq) => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onSelect={onSelectEquipment}
              onBook={onSelectEquipment}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW AGRIRIDE WORKS */}
      <section id="how-it-works" className="bg-white py-20 border-y border-agri-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="gold" className="uppercase font-semibold tracking-wider text-xs">
              Simple 4-Step Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-agri-text">
              How AgriRide Works
            </h2>
            <p className="text-sm sm:text-base text-agri-muted">
              We took the complexity out of agricultural machinery rentals. Seamless, paperless, and dependable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="bg-agri-bg rounded-2xl p-6 border border-agri-border relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-agri-forest text-agri-gold font-heading font-extrabold text-lg flex items-center justify-center shadow-md">
                01
              </div>
              <h3 className="text-lg font-bold font-heading text-agri-text">
                Search & Filter
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">
                Enter your village or district, specify required horsepower or equipment category, and review available machines.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-agri-bg rounded-2xl p-6 border border-agri-border relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-agri-leaf text-white font-heading font-extrabold text-lg flex items-center justify-center shadow-md">
                02
              </div>
              <h3 className="text-lg font-bold font-heading text-agri-text">
                Check Rates & Availability
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">
                Compare hourly and daily rates. The automated pricing calculator displays exact totals with zero hidden broker charges.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-agri-bg rounded-2xl p-6 border border-agri-border relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-agri-gold text-agri-forest font-heading font-extrabold text-lg flex items-center justify-center shadow-md">
                03
              </div>
              <h3 className="text-lg font-bold font-heading text-agri-text">
                Owner Direct Approval
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">
                Submit your booking with desired dates. The machine owner accepts your request and coordinates field delivery or pickup.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-agri-bg rounded-2xl p-6 border border-agri-border relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-agri-forest text-white font-heading font-extrabold text-lg flex items-center justify-center shadow-md">
                04
              </div>
              <h3 className="text-lg font-bold font-heading text-agri-text">
                Farm, Return & Review
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">
                Complete your plowing, sowing, or harvesting. Return the equipment, get your deposit released, and leave a verified review.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BENEFITS FOR FARMERS & OWNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card: For Farmers */}
          <div className="bg-gradient-to-br from-white to-agri-lightgreen rounded-3xl p-8 sm:p-10 border border-agri-leaf/30 shadow-card flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-agri-forest text-agri-gold flex items-center justify-center mb-6 shadow-md">
                <Wheat className="w-6 h-6" />
              </div>
              <Badge variant="primary" className="mb-2">For Small & Marginal Farmers</Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-agri-forest">
                Maximize Yields Without Machinery Debt
              </h3>
              <p className="text-sm text-agri-text/80 mt-2 mb-6">
                Avoid lakhs in bank loans and interest. Get access to the newest tractors and implements right at your field doorstep.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-agri-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-success shrink-0 mt-0.5" />
                  <span><strong>Save up to 70%</strong> on upfront capital expenditure</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-success shrink-0 mt-0.5" />
                  <span><strong>Access precision technology</strong> like DJI drones and laser levellers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-success shrink-0 mt-0.5" />
                  <span><strong>Optional trained drivers</strong> included for heavy operations</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-success shrink-0 mt-0.5" />
                  <span><strong>No maintenance or storage liabilities</strong> during off-seasons</span>
                </li>
              </ul>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-bold text-agri-forest hover:text-agri-leaf transition-colors pt-4 border-t border-agri-border"
            >
              <span>Browse Farm Gear</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card: For Equipment Owners */}
          <div className="bg-gradient-to-br from-white to-[#FDF8EC] rounded-3xl p-8 sm:p-10 border border-agri-gold/40 shadow-card flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-agri-gold text-agri-forest flex items-center justify-center mb-6 shadow-md">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Badge variant="gold" className="mb-2">For Tractor & Fleet Owners</Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-agri-forest">
                Turn Idle Farm Machinery Into Monthly Profits
              </h3>
              <p className="text-sm text-agri-text/80 mt-2 mb-6">
                Most tractors sit idle for 7 to 8 months a year. Monetize your machinery downtime through verified, safe farmer bookings.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-agri-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                  <span><strong>Earn ₹40,000 to ₹1,20,000</strong> per month during peak rental seasons</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                  <span><strong>Complete control:</strong> accept or decline bookings based on your schedule</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                  <span><strong>Mandatory refundable security deposits</strong> to ensure machine care</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-leaf shrink-0 mt-0.5" />
                  <span><strong>Verified renter KYC</strong> and real-time dashboard analytics</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth ? onOpenAuth('owner') : null}
              className="inline-flex items-center gap-2 text-sm font-bold text-agri-forest hover:text-agri-leaf transition-colors pt-4 border-t border-agri-border text-left"
            >
              <span>List Your Equipment Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-agri-lightgreen/60 py-20 border-y border-agri-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <Badge variant="primary" className="text-xs">Real Field Stories</Badge>
            <h2 className="text-3xl font-extrabold font-heading text-agri-forest">
              Trusted by 1,000+ Farmers Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-1 text-agri-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-agri-gold" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-agri-text leading-relaxed italic">
                "I needed a 75 HP tractor with laser leveller for just 3 days of paddy prep in Samrala. Buying one was out of question. Through AgriRide, Sardar Gurpreet provided his Mahindra with driver within 4 hours. Smooth and transparent!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-agri-border">
                <div className="w-9 h-9 rounded-full bg-agri-forest text-white flex items-center justify-center font-bold text-xs">
                  JS
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-agri-text">Jaswinder Singh</div>
                  <div className="text-[11px] text-agri-muted">Wheat & Rice Farmer, Ludhiana</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-1 text-agri-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-agri-gold" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-agri-text leading-relaxed italic">
                "Hiring a DJI Agras drone through AgriRide saved my pomegranate crop in Nashik from pest infestation. Manual spraying would have taken 4 days; the drone finished 15 acres in 2.5 hours with 40% less chemical usage."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-agri-border">
                <div className="w-9 h-9 rounded-full bg-agri-leaf text-white flex items-center justify-center font-bold text-xs">
                  VP
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-agri-text">Vikram Patil</div>
                  <div className="text-[11px] text-agri-muted">Horticulture Farmer, Nashik</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-agri-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-1 text-agri-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-agri-gold" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-agri-text leading-relaxed italic">
                "As an equipment owner, listing my Preet combine harvester on AgriRide gave me confirmed bookings for the entire wheat harvest season in Amritsar. Earned over ₹1.8 lakhs with prompt direct payments."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-agri-border">
                <div className="w-9 h-9 rounded-full bg-agri-gold text-agri-forest flex items-center justify-center font-bold text-xs">
                  BG
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-agri-text">Baldev Gill</div>
                  <div className="text-[11px] text-agri-muted">Fleet Owner, Amritsar</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. HIGH-IMPACT FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-agri-forest rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl hero-pattern">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
              Ready to Modernize Your Farm Operations?
            </h2>
            <p className="text-sm sm:text-base text-agri-border max-w-xl mx-auto leading-relaxed">
              Join thousands of forward-thinking farmers and machinery owners across India using AgriRide to cut costs, boost yields, and farm smarter.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/marketplace"
                className="px-8 py-3.5 rounded-xl bg-agri-gold text-agri-text font-heading font-bold text-base shadow-lg hover:bg-[#edd085] hover:scale-105 transition-all"
              >
                Browse All Machinery
              </Link>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('owner') : null}
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-semibold text-base border border-white/20 transition-all"
              >
                Become an Equipment Partner
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
