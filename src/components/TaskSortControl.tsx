import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SortIcon from '@mui/icons-material/Sort';
import { TASK_SORT_OPTIONS, TaskSortField } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskSortControlProps {
  sortField: TaskSortField;
  sortDirection: 'asc' | 'desc';
  onSortFieldChange: (sortField: TaskSortField) => void;
  onSortDirectionChange: (sortDirection: 'asc' | 'desc') => void;
}

export const TaskSortControl: React.FC<TaskSortControlProps> = ({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange
}) => {
  const { darkMode } = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onSortFieldChange(event.target.value as TaskSortField);
  };

  return (
    <div className="mb-2 flex max-w-full items-center gap-2">
      <FormControl
        variant="outlined"
        sx={{
          minWidth: 240,
          maxWidth: '100%'
        }}
        size="small"
      >
        <InputLabel
          id="task-sort-label"
          className={darkMode ? 'text-gray-300' : ''}
          sx={{
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '',
            '&.Mui-focused': {
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : ''
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SortIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Ordenar tareas por
          </Box>
        </InputLabel>
        <Select
          labelId="task-sort-label"
          value={sortField}
          label=".......Ordenar tareas por"
          onChange={handleChange}
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
          {TASK_SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value} className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        size="medium"
        startIcon={<SwapVertIcon />}
        onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
        sx={{
          minWidth: 96,
          height: 40,
          whiteSpace: 'nowrap'
        }}
      >
        {sortDirection === 'asc' ? 'ASC' : 'DES'}
      </Button>
    </div>
  );
};