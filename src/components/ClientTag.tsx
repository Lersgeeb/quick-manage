import React from 'react';

interface ClientTagProps {
  client: string;
  color: string;
  className?: string;
}

export const ClientTag: React.FC<ClientTagProps> = ({ client, color, className = '' }) => {
  return (
    <div 
      className={`px-2 py-1 rounded-md text-xs font-medium ${className}`} 
      style={{ 
        backgroundColor: color,
        color: isLightColor(color) ? '#000' : '#fff'
      }}
    >
      {client}
    </div>
  );
};

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5; // If > 0.5 then it's considered light
}
