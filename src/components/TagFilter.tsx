import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';

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
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onTagSelect(value === 'all' ? null : value);
  };

  // El valor para mostrar en el selector
  const displayValue = selectedTag === null ? 'all' : selectedTag;

  return (
    <FormControl 
      variant="outlined" 
      sx={{ 
        minWidth: 200, 
        maxWidth: '100%',
        mb: 2
      }}
      size="small"
    >
      <InputLabel id="tag-filter-label">
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
      >
        <MenuItem value="all">
          <em>Todas las etiquetas</em>
        </MenuItem>
        {tags.map((tagInfo) => (
          <MenuItem key={tagInfo.tag} value={tagInfo.tag}>
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
