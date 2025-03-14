import React from 'react';

interface TagBadgeProps {
  tag: string;
  color: string;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, color = '#f87171', className = '' }) => {
  return (
    <div 
      className={`px-2 py-1 rounded-md text-xs font-medium ${className}`} 
      style={{ 
        backgroundColor: color || '#f87171',
        color: isLightColor(color || '#f87171') ? '#000' : '#fff'
      }}
    >
      {tag || 'Sin etiqueta'}
    </div>
  );
};

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  if (!color) return true; // Default to light color handling if no color

  try {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Check if the parsing was successful
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return true; // Default to light color for invalid hex
    }
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5; // If > 0.5 then it's considered light
  } catch (error) {
    console.error('Error processing color:', color, error);
    return true; // Default to light color on error
  }
}
