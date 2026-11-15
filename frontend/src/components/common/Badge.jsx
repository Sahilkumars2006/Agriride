import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-agri-bg text-agri-text border border-agri-border',
    success: 'bg-[#EBF7EE] text-[#1E7E52] border border-[#BDE8CB]',
    warning: 'bg-[#FDF6E8] text-[#B07412] border border-[#F6DEAE]',
    danger: 'bg-[#FDF0F0] text-[#B83232] border border-[#F8C8C8]',
    primary: 'bg-[#EBF3EF] text-[#174D35] border border-[#C5DDD2] font-medium',
    gold: 'bg-[#FDF8EC] text-[#9A741E] border border-[#F7E5BD] font-medium',
    dark: 'bg-[#174D35] text-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};
