import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '../contexts/ThemeContext';

interface TagFilterProps {
  tags: { tag: string; color: string }[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ 
  tags, 
  selectedTag, 
  onTagSelect 
}) => {
  const { darkMode } = useTheme();
  
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onTagSelect(value === 'all' ? null : value);
  };

  // El valor para mostrar en el selector
  const displayValue = selectedTag === null ? 'all' : selectedTag;

  const darkModeClasses = darkMode ? {
    formControl: 'border-gray-700',
    select: 'text-gray-100',
    menuItem: 'text-gray-100 hover:bg-gray-700'
  } : {};

  return (
    <FormControl 
      variant="outlined" 
      sx={{ 
        minWidth: 200, 
        maxWidth: '100%',
        mb: 2
      }}
      size="small"
      className={darkModeClasses.formControl}
    >
      <InputLabel 
        id="tag-filter-label" 
        className={darkMode ? 'text-gray-300' : ''}
        sx={{
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '',
          '&.Mui-focused': {
            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : ''
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Filtrar por etiqueta
        </Box>
      </InputLabel>
      <Select
        labelId="tag-filter-label"
        value={displayValue}
        label=".......Filtrar por etiqueta"
        onChange={handleChange}
        className={darkModeClasses.select}
        sx={{
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : ''
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : ''
          },
          '.MuiSvgIcon-root': {
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : ''
          },
          color: darkMode ? 'white' : 'inherit'
        }}
        MenuProps={{
          PaperProps: {
            className: darkMode ? 'bg-gray-800' : ''
          }
        }}
      >
        <MenuItem value="all" className={darkModeClasses.menuItem}>
          <em>Todas las etiquetas</em>
        </MenuItem>
        {tags.map((tagInfo) => (
          <MenuItem key={tagInfo.tag} value={tagInfo.tag} className={darkModeClasses.menuItem}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: tagInfo.color || '#f87171',
                  mr: 1 
                }} 
              />
              {tagInfo.tag}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
