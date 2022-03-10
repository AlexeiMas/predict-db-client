import React, {FC, useCallback} from 'react';
import {styled} from '@mui/material/styles';
import Dialog from "@mui/material/Dialog";
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody"

const ModalDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export type TModalWindow = {
  open: boolean,
  handleOpen: React.Dispatch<boolean>
}

const ModalWindow: FC<TModalWindow> = ({open, handleOpen}) => {

  const handleClose = useCallback(() => {
      handleOpen(false)
    }, [open],
  );

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      fullScreen={(window.innerWidth <= 520)}
      maxWidth={"md"}
      fullWidth={true}
      aria-labelledby="add-plot"
    >
      <ModalHeader id="add-plot" onClose={handleClose}>
        Add Plot
      </ModalHeader>
      <ModalBody/>
    </ModalDialog>
  );
};

export default ModalWindow;
