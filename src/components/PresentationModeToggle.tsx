import React from 'react';
import { BoardViewMode } from '../types';
import Button from '@mui/material/Button';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Tooltip from '@mui/material/Tooltip';

interface PresentationModeToggleProps {
  viewMode: BoardViewMode;
  onToggle: () => void;
}

export const PresentationModeToggle: React.FC<PresentationModeToggleProps> = ({ 
  viewMode, 
  onToggle 
}) => {
  const isPresentation = viewMode === 'presentation';
  
  return (
    <Tooltip title={isPresentation ? "Volver a modo normal" : "Cambiar a modo presentación"}>
      <Button
        variant={isPresentation ? "outlined" : "contained"}
        color={isPresentation ? "secondary" : "primary"}
        startIcon={isPresentation ? <DashboardIcon /> : <SlideshowIcon />}
        onClick={onToggle}
        sx={{ ml: 1 }}
      >
        {isPresentation ? "Modo Normal" : "Modo Presentación"}
      </Button>
    </Tooltip>
  );
};
