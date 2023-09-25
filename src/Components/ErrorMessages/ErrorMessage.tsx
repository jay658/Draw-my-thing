import { StyledAlert, StyledStack } from './StyledComponents';

import Snackbar from '@mui/material/Snackbar';
import { SyntheticEvent } from 'react'

type OwnPropsT = {
  error: string | null,
  openError: boolean,
  setOpenError: (open: boolean) => void
}

export default function ErrorMessages({error, openError, setOpenError}: OwnPropsT) {

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
  };

  return (
    <StyledStack spacing={2}>
        {error && 
          <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <StyledAlert severity="error">{error}</StyledAlert>
          </Snackbar>
        } 
    </StyledStack>
  );
}