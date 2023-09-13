import { StyledAlert, StyledStack } from './StyledComponents';

import type { JoinScreenErrorsT } from '../JoinScreen/Types'
import Snackbar from '@mui/material/Snackbar';
import { SyntheticEvent } from 'react'
import type { WaitingRoomErrorsT } from '../WaitingRoom/Types'

type OwnPropsT = {
  error: Partial<JoinScreenErrorsT & WaitingRoomErrorsT>,
  openError: boolean,
  setOpenError: (open: boolean) => void
}

export default function ErrorMessages({error, openError, setOpenError}: OwnPropsT) {
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