import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SyntheticEvent, forwardRef } from 'react'

import type { ErrorStateT } from './JoinScreen'
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type JoinScreenErrorsPropsT = {
  error: ErrorStateT,
  openError: boolean,
  setOpenError: (open: boolean) => void
}

export default function JoinScreenErrors({error, openError, setOpenError}: JoinScreenErrorsPropsT) {
  const { roomNameTaken, roomNotFound } = error
  
  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {roomNotFound &&
      <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="error" sx={{ width: '100%' }}>{roomNotFound}</Alert>
      </Snackbar>}
      {roomNameTaken &&
      <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="error" sx={{ width: '100%' }}>{roomNameTaken}</Alert>
      </Snackbar>}
    </Stack>
  );
}