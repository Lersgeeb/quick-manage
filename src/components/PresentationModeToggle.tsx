import React from 'react';
import { BoardViewMode } from '../types';
import Button from '@mui/material/Button';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Tooltip from '@mui/material/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';

interface PresentationModeToggleProps {
  viewMode: BoardViewMode;
  onToggle: () => void;
}

export const PresentationModeToggle: React.FC<PresentationModeToggleProps> = ({ 
  viewMode, 
  onToggle 
}) => {
  const isPresentation = viewMode === 'presentation';
  const { t } = useLanguage();
  
  return (
    <Tooltip title={isPresentation ? t('view.presentationOff') : t('view.presentationOn')}>
      <Button
        variant={isPresentation ? "outlined" : "contained"}
        color={isPresentation ? "secondary" : "primary"}
        startIcon={isPresentation ? <DashboardIcon /> : <SlideshowIcon />}
        onClick={onToggle}
        sx={{ ml: 1 }}
      >
        {isPresentation ? t('view.normal') : t('view.presentation')}
      </Button>
    </Tooltip>
  );
};
