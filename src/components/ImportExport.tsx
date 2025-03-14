import React, { useRef, useState } from 'react';
import { useBoard } from '../hooks/useBoard';
import { useImportExport } from '../hooks/useImportExport';
import { useStorage } from '../hooks/useStorage';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const ImportExport: React.FC = () => {
  const { board } = useBoard();
  const { exportBoard, importBoard } = useImportExport();
  const { clearBoard, saveBoard } = useStorage();
  
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
    exportBoard(board);
    handleCloseMenu();
    showAlert('Tablero exportado exitosamente', 'success');
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
      showAlert('Tablero importado exitosamente', 'success');
      // Reload the page to show the imported board
      window.location.reload();
    } catch (error) {
      console.error('Error importing board:', error);
      showAlert('Error al importar el tablero', 'error');
    }

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleClearBoard = () => {
    clearBoard();
    setIsDeleteDialogOpen(false);
    showAlert('Tablero eliminado', 'success');
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
        Opciones
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
          <ListItemText>Exportar tablero</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Importar tablero</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { setIsDeleteDialogOpen(true); handleCloseMenu(); }}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar tablero</ListItemText>
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
      >
        <DialogTitle>Eliminar tablero</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar el tablero? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleClearBoard} color="error" variant="contained">
            Eliminar
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
