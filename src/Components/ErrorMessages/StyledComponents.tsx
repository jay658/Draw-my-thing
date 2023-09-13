import MuiAlert, { AlertProps } from '@mui/material/Alert';

import Stack from '@mui/material/Stack';
import { forwardRef } from 'react'
import { styled } from '@mui/material/styles';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledStack = styled(Stack)(() => ({
  width: '100%'
}))

const StyledAlert = styled(Alert)(() => ({
  width: '100%'
}))

export {
  StyledStack,
  StyledAlert,
}