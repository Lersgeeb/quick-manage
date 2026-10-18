import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../contexts/LanguageContext';
import { Task } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import {
  getDialogActionsSx,
  getDialogContentSx,
  getDialogSx,
  getDialogTextFieldSx,
  getDialogTitleSx,
  getPrimaryDialogButtonSx,
  secondaryDialogButtonSx
} from './dialogTheme';

interface TaskNextStepModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, nextStep: string) => void;
  onComplete: (taskId: string, nextStep: string) => void;
}

export const TaskNextStepModal: React.FC<TaskNextStepModalProps> = ({
  open,
  task,
  onClose,
  onSave,
  onComplete
}) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const [nextStep, setNextStep] = useState('');

  useEffect(() => {
    setNextStep(task?.nextStep || '');
  }, [task]);

  if (!task) {
    return null;
  }

  const trimmedNextStep = nextStep.trim();
  const hasChanges = nextStep !== (task.nextStep || '');

  const handleSave = () => {
    onSave(task.id, nextStep);
    onClose();
  };

  const handleComplete = () => {
    onComplete(task.id, nextStep);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={getDialogSx(darkMode)}
    >
      <DialogTitle sx={getDialogTitleSx(darkMode)}>
        {t('nextStep.title')}
      </DialogTitle>
      <DialogContent sx={getDialogContentSx(darkMode)}>
        <div className="space-y-4 pt-2">
          <Typography className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
            {task.title}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label={t('nextStep.question')}
            value={nextStep}
            onChange={(event) => setNextStep(event.target.value)}
            placeholder={t('nextStep.placeholder')}
            sx={getDialogTextFieldSx(darkMode)}
          />
        </div>
      </DialogContent>
      <DialogActions sx={getDialogActionsSx(darkMode)}>
        <Button onClick={onClose} variant="outlined" sx={secondaryDialogButtonSx}>
          {t('board.cancel')}
        </Button>
        <Button
          onClick={handleComplete}
          variant="outlined"
          color="success"
          disabled={!trimmedNextStep}
        >
          {t('nextStep.complete')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!hasChanges}
          sx={getPrimaryDialogButtonSx(darkMode)}
        >
          {t('nextStep.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
