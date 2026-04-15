import { SxProps, Theme } from '@mui/material/styles';

const lightSurface = '#ffffff';
const darkSurface = '#111827';
const lightMutedSurface = '#f8fafc';
const darkMutedSurface = '#1f2937';
const lightBorder = 'rgba(15, 23, 42, 0.08)';
const darkBorder = 'rgba(148, 163, 184, 0.2)';
const accent = '#2563eb';

export const getDialogSx = (darkMode: boolean): SxProps<Theme> => ({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
    backgroundColor: darkMode ? 'rgba(2, 6, 23, 0.72)' : 'rgba(148, 163, 184, 0.28)'
  },
  '& .MuiPaper-root': {
    backgroundColor: darkMode ? darkSurface : lightSurface,
    color: darkMode ? '#f8fafc' : '#0f172a',
    border: `1px solid ${darkMode ? darkBorder : lightBorder}`,
    borderRadius: '20px',
    boxShadow: darkMode
      ? '0 28px 80px rgba(2, 6, 23, 0.55)'
      : '0 28px 80px rgba(15, 23, 42, 0.18)',
    backgroundImage: darkMode
      ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.96) 0%, rgba(17, 24, 39, 0.98) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)'
  }
});

export const getDialogTitleSx = (darkMode: boolean): SxProps<Theme> => ({
  px: 3,
  pt: 3,
  pb: 1.5,
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: darkMode ? '#f8fafc' : '#0f172a'
});

export const getDialogContentSx = (darkMode: boolean): SxProps<Theme> => ({
  px: 3,
  py: 2,
  color: darkMode ? 'rgba(226, 232, 240, 0.92)' : '#334155'
});

export const getDialogContentTextSx = (darkMode: boolean): SxProps<Theme> => ({
  mb: 2,
  color: darkMode ? 'rgba(203, 213, 225, 0.82)' : '#475569'
});

export const getDialogActionsSx = (darkMode: boolean): SxProps<Theme> => ({
  px: 3,
  pb: 3,
  pt: 1,
  gap: 1,
  borderTop: `1px solid ${darkMode ? darkBorder : lightBorder}`,
  backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.28)' : 'rgba(248, 250, 252, 0.8)'
});

export const getDialogTextFieldSx = (darkMode: boolean): SxProps<Theme> => ({
  '& .MuiInputLabel-root': {
    color: darkMode ? 'rgba(203, 213, 225, 0.78)' : '#64748b'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: darkMode ? '#93c5fd' : accent
  },
  '& .MuiOutlinedInput-root': {
    color: darkMode ? '#f8fafc' : '#0f172a',
    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.62)' : lightMutedSurface,
    borderRadius: '14px',
    '& fieldset': {
      borderColor: darkMode ? 'rgba(148, 163, 184, 0.22)' : 'rgba(148, 163, 184, 0.3)'
    },
    '&:hover fieldset': {
      borderColor: darkMode ? 'rgba(147, 197, 253, 0.45)' : 'rgba(37, 99, 235, 0.45)'
    },
    '&.Mui-focused fieldset': {
      borderColor: darkMode ? '#93c5fd' : accent,
      borderWidth: 1
    }
  }
});

export const getPrimaryDialogButtonSx = (darkMode: boolean): SxProps<Theme> => ({
  borderRadius: '12px',
  px: 2,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  backgroundColor: darkMode ? '#3b82f6' : accent,
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: darkMode ? '#2563eb' : '#1d4ed8'
  }
});

export const secondaryDialogButtonSx: SxProps<Theme> = {
  borderRadius: '12px',
  px: 2,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none'
};

export const dangerDialogButtonSx: SxProps<Theme> = {
  borderRadius: '12px',
  px: 2,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none'
  }
};

export const getModalSectionSx = (darkMode: boolean): SxProps<Theme> => ({
  borderRadius: '16px',
  border: `1px solid ${darkMode ? darkBorder : lightBorder}`,
  backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.38)' : 'rgba(248, 250, 252, 0.92)',
  p: 2
});

export const getModalDividerSx = (darkMode: boolean): SxProps<Theme> => ({
  borderColor: darkMode ? darkBorder : lightBorder
});

export const getModalMutedTextSx = (darkMode: boolean): SxProps<Theme> => ({
  color: darkMode ? 'rgba(203, 213, 225, 0.78)' : '#475569'
});

export const getModalInnerSurfaceSx = (darkMode: boolean): SxProps<Theme> => ({
  backgroundColor: darkMode ? darkMutedSurface : lightMutedSurface,
  border: `1px solid ${darkMode ? darkBorder : lightBorder}`,
  borderRadius: '16px'
});