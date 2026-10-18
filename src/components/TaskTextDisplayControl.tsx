import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { TASK_TEXT_DISPLAY_OPTIONS, TaskTextDisplayMode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskTextDisplayControlProps {
  displayMode: TaskTextDisplayMode;
  onDisplayModeChange: (displayMode: TaskTextDisplayMode) => void;
}

export const TaskTextDisplayControl: React.FC<TaskTextDisplayControlProps> = ({
  displayMode,
  onDisplayModeChange
}) => {
  const { darkMode } = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onDisplayModeChange(event.target.value as TaskTextDisplayMode);
  };

  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: 210,
        maxWidth: '100%',
        mb: 2
      }}
      size="small"
    >
      <InputLabel
        id="task-text-display-label"
        className={darkMode ? 'text-gray-300' : ''}
        sx={{
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '',
          '&.Mui-focused': {
            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : ''
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextFieldsIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Texto a mostrar
        </Box>
      </InputLabel>
      <Select
        labelId="task-text-display-label"
        value={displayMode}
        label=".......Texto a mostrar"
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
        {TASK_TEXT_DISPLAY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value} className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
