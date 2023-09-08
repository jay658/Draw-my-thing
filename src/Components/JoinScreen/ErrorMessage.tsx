import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SyntheticEvent, forwardRef } from 'react'

import type { JoinScreenErrorsT } from './JoinScreen'
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import type { WaitingRoomErrorsT } from './WaitingRoom'
import { styled } from '@mui/material/styles';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type ErrorsPropsT = {
  error: Partial<JoinScreenErrorsT & WaitingRoomErrorsT>,
  openError: boolean,
  setOpenError: (open: boolean) => void
}

const StyledStack = styled(Stack)(() => ({
  width: '100%'
}))

const StyledAlert = styled(Alert)(() => ({
  width: '100%'
}))

export default function ErrorMessages({error, openError, setOpenError}: ErrorsPropsT) {
  const errors = Object.keys(error) as (keyof (JoinScreenErrorsT & WaitingRoomErrorsT))[]

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
  };

  return (
    <StyledStack spacing={2}>
      {errors.map((errorName)=> {
        if(error[errorName]) return (
          <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} key={errorName}>
            <StyledAlert severity="error">{error[errorName]}</StyledAlert>
          </Snackbar>
        )
      })}
    </StyledStack>
  );
}