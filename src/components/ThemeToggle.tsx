import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';

export const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const nextThemeLabel = darkMode ? t('theme.light') : t('theme.dark');
  
  return (
    <Tooltip title={nextThemeLabel}>
      <Button
        variant="outlined"
        color="inherit"
        onClick={toggleTheme}
        aria-label={nextThemeLabel}
        sx={{
          minWidth: 0,
          px: 1.5,
          color: darkMode ? 'rgb(229 231 235)' : 'rgb(31 41 55)',
          borderColor: darkMode ? 'rgb(75 85 99)' : 'rgba(31, 41, 55, 0.23)',
          '&:hover': {
            borderColor: darkMode ? 'rgb(107 114 128)' : 'rgba(31, 41, 55, 0.4)',
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(31, 41, 55, 0.04)'
          }
        }}
      >
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </Button>
    </Tooltip>
  );
};
