import React, { useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n';

const languageCodes: Language[] = ['en', 'es'];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    handleCloseMenu();
  };

  return (
    <>
      <Tooltip title={t('language.switch')}>
        <Button
          variant="outlined"
          onClick={handleOpenMenu}
          startIcon={<TranslateIcon />}
        >
          {language.toUpperCase()}
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {languageCodes.map((languageCode) => (
          <MenuItem
            key={languageCode}
            selected={language === languageCode}
            onClick={() => handleSelectLanguage(languageCode)}
          >
            <ListItemText>
              {t(languageCode === 'en' ? 'language.english' : 'language.spanish')}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
