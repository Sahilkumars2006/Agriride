import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Gauge, 
  Fuel, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const EquipmentCard = ({ equipment, onSelect, onBook }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback image generator
  const fallbackImg = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-agri-bg">
        <img
          src={imgError ? fallbackImg : (equipment.images?.[0] || fallbackImg)}
          alt={equipment.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="primary" className="bg-white/95 backdrop-blur-sm shadow-sm font-semibold text-agri-forest">
            {equipment.categoryName}
          </Badge>

          {equipment.available ? (
            <Badge variant="success" className="bg-[#EBF7EE]/95 backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-agri-success animate-pulse" />
              Available
            </Badge>
          ) : (
            <Badge variant="danger" className="bg-[#FDF0F0]/95 backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-agri-danger" />
              Booked
            </Badge>
          )}
        </div>

        {/* Bottom Tag over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-agri-gold" />
            <span className="font-medium truncate max-w-[140px]">{equipment.location}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
            <Star className="w-3.5 h-3.5 fill-agri-gold text-agri-gold" />
            <span className="font-semibold">{equipment.rating}</span>
            <span className="text-white/70">({equipment.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-semibold uppercase text-agri-leaf tracking-wider">
                {equipment.brand}
              </span>
              <h3 className="text-base font-bold font-heading text-agri-text group-hover:text-agri-forest transition-colors line-clamp-1">
                {equipment.name}
              </h3>
            </div>
          </div>

          {/* Quick Specs Badges */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs text-agri-muted">
            <div className="flex items-center gap-1.5 bg-agri-bg px-2.5 py-1.5 rounded-lg border border-agri-border/60">
              <Gauge className="w-3.5 h-3.5 text-agri-leaf shrink-0" />
              <span className="truncate">{equipment.power}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-agri-bg px-2.5 py-1.5 rounded-lg border border-agri-border/60">
              <UserCheck className="w-3.5 h-3.5 text-agri-leaf shrink-0" />
              <span className="truncate">
                {equipment.operatorIncluded ? 'Driver Included' : 'Self-Operated'}
              </span>
            </div>
          </div>

          {/* Owner summary */}
          <div className="flex items-center gap-2 pt-1 pb-3 text-xs text-agri-muted border-b border-agri-border/60">
            <span className="text-agri-text font-medium">Owner:</span>
            <span className="truncate">{equipment.owner.name}</span>
            {equipment.owner.verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf shrink-0" title="Verified Owner" />
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl font-extrabold text-agri-forest font-heading">
                ₹{equipment.pricePerHour}
              </span>
              <span className="text-xs text-agri-muted ml-1">/ hour</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-agri-text">
                ₹{equipment.pricePerDay}
              </span>
              <span className="text-xs text-agri-muted ml-0.5">/ day</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(equipment)}
              className="w-full py-2 px-3 rounded-lg border border-agri-border text-agri-text text-xs font-semibold hover:bg-agri-bg hover:border-agri-forest/30 transition-all text-center"
            >
              View Specs
            </button>
            <button
              onClick={() => onBook(equipment)}
              disabled={!equipment.available}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all shadow-sm ${
                equipment.available
                  ? 'bg-agri-forest text-white hover:bg-[#123e2a] hover:shadow'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {equipment.available ? 'Rent Now' : 'Reserved'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
