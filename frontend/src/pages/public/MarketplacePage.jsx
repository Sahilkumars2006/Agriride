import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Tractor, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MOCK_EQUIPMENT } from '../../data/mockEquipment';
import { CATEGORIES } from '../../data/categories';
import { equipmentService } from '../../services/equipmentService';
import { EquipmentCard } from '../../components/marketplace/EquipmentCard';
import { FilterSidebar } from '../../components/marketplace/FilterSidebar';
import { Badge } from '../../components/common/Badge';

export const MarketplacePage = ({ onSelectEquipment }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('All States');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [operatorOnly, setOperatorOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize with URL search query params
  useEffect(() => {
    const catQuery = searchParams.get('category');
    const stateQuery = searchParams.get('state');
    if (catQuery && CATEGORIES.some(c => c.id === catQuery)) {
      setSelectedCategory(catQuery);
    }
    if (stateQuery) {
      setSelectedState(stateQuery);
    }
  }, [searchParams]);

  // Fetch equipment from backend API with fallback
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedState !== 'All States') params.state = selectedState;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (maxPrice < 1500) params.max_price = maxPrice;
        if (onlyAvailable) params.available = true;
        if (operatorOnly) params.operator_included = true;
        if (sortBy) params.sort_by = sortBy;

        const data = await equipmentService.getEquipment(params);
        const results = data?.results || (Array.isArray(data) ? data : []);

        if (results && results.length > 0) {
          // Normalize API data fields to match UI
          const normalized = results.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: item.category,
            categoryName: item.category_name || item.category,
            power: item.power,
            pricePerHour: Number(item.price_per_hour),
            pricePerDay: Number(item.price_per_day),
            securityDeposit: Number(item.security_deposit || 1000),
            location: item.location,
            state: item.state,
            available: item.available,
            operatorIncluded: item.operator_included,
            rating: item.rating || 4.9,
            reviewsCount: item.reviews_count || 24,
            featured: item.featured,
            images: item.images && item.images.length > 0 ? item.images : ['/images/equipment/mahindra-novo-755.jpg'],
            owner: item.owner || { name: 'Verified Partner', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
            description: item.description || 'High-performance agricultural machinery.',
            specs: item.specs || {}
          }));
          setEquipmentList(normalized);
        } else {
          // Filter locally from MOCK_EQUIPMENT as fallback
          let filtered = [...MOCK_EQUIPMENT];
          if (selectedCategory !== 'all') filtered = filtered.filter(i => i.category === selectedCategory);
          if (selectedState !== 'All States') filtered = filtered.filter(i => i.state === selectedState);
          if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(i => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q));
          }
          filtered = filtered.filter(i => i.pricePerHour <= maxPrice);
          if (onlyAvailable) filtered = filtered.filter(i => i.available);
          if (operatorOnly) filtered = filtered.filter(i => i.operatorIncluded);
          setEquipmentList(filtered);
        }
      } catch (err) {
        console.warn('Backend equipment API unreachable, using local dataset:', err);
        setEquipmentList(MOCK_EQUIPMENT);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [searchTerm, selectedCategory, selectedState, maxPrice, onlyAvailable, operatorOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedState('All States');
    setMaxPrice(1500);
    setOnlyAvailable(false);
    setOperatorOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-agri-bg pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-agri-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" className="text-xs">
                  Marketplace Fleet
                </Badge>
                <span className="text-xs text-agri-muted">
                  • {equipmentList.length} machines available
                </span>
              </div>
              <h1 className="text-3xl font-extrabold font-heading text-agri-forest">
                Agricultural Equipment Fleet
              </h1>
              <p className="text-sm text-agri-muted mt-1 max-w-2xl">
                Compare verified tractors, combines, tillage tools, and drone sprayers across key farming states with guaranteed fair pricing.
              </p>
            </div>

            {/* Mobile filter toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-agri-forest text-white text-xs font-semibold shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-agri-gold" />
                <span>Filters ({selectedCategory !== 'all' ? 1 : 0})</span>
              </button>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-agri-forest text-white shadow-sm'
                    : 'bg-agri-bg text-agri-text border border-agri-border hover:border-agri-forest/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28">
            <FilterSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onlyAvailable={onlyAvailable}
              setOnlyAvailable={setOnlyAvailable}
              operatorOnly={operatorOnly}
              setOperatorOnly={setOperatorOnly}
              onReset={handleResetFilters}
              totalResults={equipmentList.length}
            />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
              <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-agri-border">
                  <h3 className="font-heading font-bold text-sm">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-agri-muted" />
                  </button>
                </div>
                <FilterSidebar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  onlyAvailable={onlyAvailable}
                  setOnlyAvailable={setOnlyAvailable}
                  operatorOnly={operatorOnly}
                  setOperatorOnly={setOperatorOnly}
                  onReset={handleResetFilters}
                  totalResults={equipmentList.length}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-agri-forest text-white text-xs font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Listings (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Sort Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-agri-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-agri-muted">
                Showing <strong className="text-agri-forest">{equipmentList.length}</strong> available machines
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-agri-muted shrink-0" />
                <span className="text-xs font-semibold text-agri-text">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold rounded-lg border border-agri-border bg-agri-bg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-agri-leaf"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-agri-forest border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-agri-muted">Loading agricultural fleet...</p>
              </div>
            ) : equipmentList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipmentList.map((equipment) => (
                  <EquipmentCard
                    key={equipment.id}
                    equipment={equipment}
                    onSelect={onSelectEquipment}
                    onBook={onSelectEquipment}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-agri-border shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-agri-bg flex items-center justify-center text-agri-muted mx-auto">
                  <Tractor className="w-8 h-8 text-agri-muted" />
                </div>
                <h3 className="font-heading font-bold text-lg text-agri-text">
                  No Matching Farm Equipment Found
                </h3>
                <p className="text-xs text-agri-muted max-w-sm mx-auto">
                  We couldn't find machinery matching your active criteria. Try broadening your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-forest text-white text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
