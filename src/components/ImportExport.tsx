import React, { useRef, useState } from 'react';
import { useImportExport } from '../hooks/useImportExport';
import { useStorage } from '../hooks/useStorage';
import { Board, Task } from '../types';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableViewIcon from '@mui/icons-material/TableView';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  dangerDialogButtonSx,
  getDialogActionsSx,
  getDialogContentSx,
  getDialogContentTextSx,
  getDialogSx,
  getDialogTitleSx,
  secondaryDialogButtonSx
} from './dialogTheme';

interface ImportExportProps {
  board: Board;
  filteredTasks: Task[];
}

export const ImportExport: React.FC<ImportExportProps> = ({ board, filteredTasks }) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const { exportBoard, exportTasksCsv, exportTasksExcel, importBoard } = useImportExport();
  const { clearBoard, saveBoard, loadBoard } = useStorage();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    // Get the most up-to-date board data from localStorage
    const latestBoard = loadBoard() || board;
    exportBoard(latestBoard);
    handleCloseMenu();
    showAlert(t('options.boardExported'), 'success');
  };

  const handleExportCsv = () => {
    const latestBoard = loadBoard() || board;
    const allTasks = latestBoard.columns
      .slice()
      .sort((firstColumn, secondColumn) => firstColumn.order - secondColumn.order)
      .flatMap(column => column.tasks.slice().sort((firstTask, secondTask) => firstTask.order - secondTask.order));
    exportTasksCsv(latestBoard, allTasks, t('export.tasksFile'));
    handleCloseMenu();
    showAlert(t('options.csvExported'), 'success');
  };

  const handleExportFilteredCsv = () => {
    const latestBoard = loadBoard() || board;
    exportTasksCsv(latestBoard, filteredTasks, t('export.filteredTasksFile'));
    handleCloseMenu();
    showAlert(t('options.csvFilteredExported'), 'success');
  };

  const handleExportExcel = async () => {
    const latestBoard = loadBoard() || board;
    const allTasks = latestBoard.columns
      .slice()
      .sort((firstColumn, secondColumn) => firstColumn.order - secondColumn.order)
      .flatMap(column => column.tasks.slice().sort((firstTask, secondTask) => firstTask.order - secondTask.order));

    try {
      await exportTasksExcel(latestBoard, allTasks, t('export.tasksFile'));
      showAlert(t('options.excelExported'), 'success');
    } catch (error) {
      console.error('Error exporting tasks to Excel:', error);
      showAlert(t('options.exportExcelError'), 'error');
    } finally {
      handleCloseMenu();
    }
  };

  const handleExportFilteredExcel = async () => {
    const latestBoard = loadBoard() || board;

    try {
      await exportTasksExcel(latestBoard, filteredTasks, t('export.filteredTasksFile'));
      showAlert(t('options.excelFilteredExported'), 'success');
    } catch (error) {
      console.error('Error exporting filtered tasks to Excel:', error);
      showAlert(t('options.exportExcelFilteredError'), 'error');
    } finally {
      handleCloseMenu();
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    handleCloseMenu();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedBoard = await importBoard(file);
      // Save the imported board to localStorage
      saveBoard(importedBoard);
      showAlert(t('options.imported'), 'success');
      // Reload the page to show the imported board
      window.location.reload();
    } catch (error) {
      console.error('Error importing board:', error);
      showAlert(t('options.importError'), 'error');
    }

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleClearBoard = () => {
    clearBoard();
    setIsDeleteDialogOpen(false);
    showAlert(t('options.deleted'), 'success');
    // Reload the page to reset the board
    window.location.reload();
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<ExpandMoreIcon />}
        onClick={handleOpenMenu}
      >
        {t('options.label')}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('options.exportBoard')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleExportCsv}>
          <ListItemIcon>
            <TableViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('options.exportCsv')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleExportFilteredCsv}>
          <ListItemIcon>
            <TableViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('options.exportCsvFiltered')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <TableViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('options.exportExcel')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleExportFilteredExcel}>
          <ListItemIcon>
            <TableViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('options.exportExcelFiltered')}</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('options.importBoard')}</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { setIsDeleteDialogOpen(true); handleCloseMenu(); }}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t('options.deleteBoard')}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Confirmation dialog for clearing the board */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        sx={getDialogSx(darkMode)}
      >
        <DialogTitle sx={getDialogTitleSx(darkMode)}>{t('options.deleteDialogTitle')}</DialogTitle>
        <DialogContent sx={getDialogContentSx(darkMode)}>
          <DialogContentText sx={getDialogContentTextSx(darkMode)}>
            {t('options.deleteDialogText')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={getDialogActionsSx(darkMode)}>
          <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outlined" sx={secondaryDialogButtonSx}>
            {t('board.cancel')}
          </Button>
          <Button onClick={handleClearBoard} color="error" variant="contained" sx={dangerDialogButtonSx}>
            {t('options.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert notifications */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};
