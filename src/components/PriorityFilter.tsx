import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FlagIcon from '@mui/icons-material/Flag';
import { TASK_PRIORITY_OPTIONS, TaskPriority } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface PriorityFilterProps {
  selectedPriority: TaskPriority | null;
  onPrioritySelect: (priority: TaskPriority | null) => void;
}

export const PriorityFilter: React.FC<PriorityFilterProps> = ({
  selectedPriority,
  onPrioritySelect
}) => {
  const { darkMode } = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as TaskPriority | 'all';
    onPrioritySelect(value === 'all' ? null : value);
  };

  const displayValue = selectedPriority === null ? 'all' : selectedPriority;

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
        id="priority-filter-label"
        className={darkMode ? 'text-gray-300' : ''}
        sx={{
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '',
          '&.Mui-focused': {
            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : ''
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FlagIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Filtrar por prioridad
        </Box>
      </InputLabel>
      <Select
        labelId="priority-filter-label"
        value={displayValue}
        label=".......Filtrar por prioridad"
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
          <em>Todas las prioridades</em>
        </MenuItem>
        {TASK_PRIORITY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value} className={darkModeClasses.menuItem}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '3px',
                  backgroundColor: option.color,
                  mr: 1
                }}
              />
              {option.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};