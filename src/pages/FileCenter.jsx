import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../services/AxiosInstance.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import {
  Button, Container, TextField, Typography, List, ListItem, Divider, Box,
  Dialog, DialogActions, DialogTitle, Alert, Snackbar,
  DialogContent, DialogContentText
} from '@mui/material';
import { PictureAsPdf, InsertDriveFile, Image } from '@mui/icons-material';

// Helper function to get the appropriate icon for a file type
const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <PictureAsPdf />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image />;
    default:
      return <InsertDriveFile />;
  }
};

const FileCenter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [emailToShare, setEmailToShare] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, isLoading, navigate]);

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const allowedFileExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt'];
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'text/plain'];
  
  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    // Validate MIME type
    const fileMimeType = selectedFile.type;
 
    if (!allowedFileTypes.includes(fileMimeType)) {
      alert('Invalid file type. Please upload a PDF, JPG, JPEG, PNG, TXT, or GIF file.');
      return;
    }

    // Validate file extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (!allowedFileExtensions.includes(fileExtension)) {
      alert('Invalid file extension. Please upload a file with PDF, JPG, JPEG, PNG, or GIF extension.');
      return;
    }

    // Validate file size
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (selectedFile.size > maxFileSize) {
      alert('File size exceeds the maximum limit (10 MB). Please choose a smaller file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    axiosInstance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      fetchFileList();
      showMessage('File uploaded successfully', 'success');
    })
    .catch(error => {
      showMessage(error.response?.data?.message || 'Error uploading file', 'error');
    });
  };

 // Memoize the fetchFileList function
 const fetchFileList = useCallback(() => {
    axiosInstance.get('/files/list')
        .then(response => {
            setFileList(response.data);
        })
        .catch(error => {
            const message = error.response?.data?.message || 'Error fetching file list.';
            showMessage(message, 'error');
        });
}, []); // Add dependencies here if there are any

  const handleDownload = (fileName) => {
    axiosInstance.get(`/files/download/${fileName}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        showMessage(error.response?.data?.message || 'Error downloading file', 'error');
      });
  };

  const handleOpenEmailDialog = (action, fileName) => {
    setCurrentAction(action);
    setCurrentFile(fileName);
    setEmailDialogOpen(true);
  };

  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
    setEmailToShare('');
    setEmailError('');
  };

  const handleAction = () => {
    if (!emailToShare) {
      setEmailError('Email cannot be empty!');
      return;
    }
    if (currentAction === 'share') {
      handleShare(currentFile);
    } else {
      handleRevokeAccess(currentFile);
    }
    handleCloseEmailDialog();
  };

  const handleShare = (fileName) => {
    axiosInstance.post(`/files/share/${fileName}`, { email: emailToShare })
      .then(response => {
        showMessage(response.data.message, 'success');
      })
      .catch(error => {
        showMessage(error.response?.data?.message || 'Error sharing file', 'error');
      });
  };

  const handleRevokeAccess = (fileName) => {
    axiosInstance.post(`/files/revokeAccess/${fileName}`, { email: emailToShare })
      .then(response => {
        showMessage(response.data.message, 'success');
      })
      .catch(error => {
        showMessage(error.response?.data?.message || 'Error revoking access', 'error');
      });
  };

  const confirmDelete = (fileName) => {
    setFileToDelete(fileName);
    setOpenDialog(true);
  };

  const handleDeleteConfirmed = () => {
    if (fileToDelete) {
      axiosInstance.delete(`/files/delete/${fileToDelete}`)
        .then(response => {
          fetchFileList();
          showMessage('File deleted successfully', 'success');
        })
        .catch(error => {
          showMessage(error.response?.data?.message || 'Error deleting file', 'error');
        });
      setFileToDelete(null);
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFileList();
    }
  }, [fetchFileList, isLoggedIn]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ bgcolor: 'background.default', py: 5, height: '100vh' }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Welcome to the Filecenter
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <TextField
          type="file"
          onChange={handleFileSelect}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mb: 2 }}
        >
          Upload File
        </Button>
        <Typography component="h2" variant="h6" gutterBottom>
          Files
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {fileList.map((file, index) => (
            <React.Fragment key={index}>
              <ListItem>
                {getFileIcon(file.filename)}
                <Typography sx={{ flex: 1, ml: 1 }}>{file.filename}</Typography>
                <Button onClick={() => handleDownload(file.filename)} sx={{ mr: 1 }}>Download</Button>
                <Button onClick={() => confirmDelete(file.filename)} sx={{ mr: 1 }}>Delete</Button>
                <Button onClick={() => handleOpenEmailDialog('share', file.filename)} sx={{ mr: 1 }}>Share</Button>
                <Button onClick={() => handleOpenEmailDialog('revoke', file.filename)}>Revoke Access</Button>
              </ListItem>
              {index < fileList.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Are you sure you want to delete this file?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={emailDialogOpen} onClose={handleCloseEmailDialog}>
        <DialogTitle>{currentAction === 'share' ? 'Share File' : 'Revoke Access'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentAction === 'share' ? 
                'Enter the email address to share the file with:' :
                'Enter the email address to revoke access from:'}
          </DialogContentText>
          <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={emailToShare}
              onChange={(e) => setEmailToShare(e.target.value)}
              error={!!emailError}
              helperText={emailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog}>Cancel</Button>
          <Button onClick={handleAction}>{currentAction === 'share' ? 'Share' : 'Revoke'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FileCenter;
