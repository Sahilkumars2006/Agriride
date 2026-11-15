import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  MapPin, 
  IndianRupee, 
  Check, 
  Layers 
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  maxPrice,
  setMaxPrice,
  onlyAvailable,
  setOnlyAvailable,
  operatorOnly,
  setOperatorOnly,
  onReset,
  totalResults
}) => {
  const states = [
    'All States',
    'Punjab',
    'Haryana',
    'Maharashtra',
    'Karnataka',
    'Uttar Pradesh',
    'Telangana',
    'Madhya Pradesh',
    'Gujarat'
  ];

  return (
    <aside className="bg-white rounded-2xl border border-agri-border p-6 shadow-sm space-y-6">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-agri-border">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-agri-forest" />
          <h2 className="font-heading font-bold text-agri-text text-base">
            Filter Machinery
          </h2>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-agri-muted hover:text-agri-danger transition-colors font-medium"
          title="Clear all active filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block">
          Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Mahindra, Harvester, Drone..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 focus:border-agri-forest text-agri-text"
          />
          <Search className="w-4 h-4 text-agri-muted absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Equipment Categories */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block">
          Equipment Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-agri-forest text-white shadow-sm'
                  : 'text-agri-text hover:bg-agri-bg hover:text-agri-forest'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-agri-bg text-agri-muted'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Geographic Location / State */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-agri-text uppercase tracking-wider block">
          State / Territory
        </label>
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-agri-border bg-agri-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-leaf/40 text-agri-text font-medium appearance-none"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <MapPin className="w-4 h-4 text-agri-muted absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Hourly Rate Filter */}
      <div className="space-y-3 pt-2 border-t border-agri-border">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-agri-text uppercase tracking-wider">
            Max Hourly Rate
          </span>
          <span className="font-bold text-agri-forest font-heading">
            Up to ₹{maxPrice}/hr
          </span>
        </div>
        <input
          type="range"
          min="150"
          max="1500"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-agri-forest cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-agri-muted font-medium">
          <span>₹150/hr</span>
          <span>₹800/hr</span>
          <span>₹1500/hr</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-agri-border">
        <label className="flex items-center gap-2.5 text-xs text-agri-text font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4 rounded text-agri-forest focus:ring-agri-leaf accent-agri-forest cursor-pointer"
          />
          <span>Show Available Machinery Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-agri-text font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={operatorOnly}
            onChange={(e) => setOperatorOnly(e.target.checked)}
            className="w-4 h-4 rounded text-agri-forest focus:ring-agri-leaf accent-agri-forest cursor-pointer"
          />
          <span>Trained Driver/Operator Included</span>
        </label>
      </div>

      {/* Match counter banner */}
      <div className="bg-agri-lightgreen rounded-xl p-3 text-center border border-agri-leaf/20">
        <span className="text-xs text-agri-forest font-medium">
          Showing <strong className="text-agri-forest font-bold">{totalResults}</strong> matching machines
        </span>
      </div>

    </aside>
  );
};
