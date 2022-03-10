import React, {FC} from 'react';
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import CloseIcon from '@material-ui/icons/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "inherit",
      fontWeight: 500,
      fontSize: "2rem"
    }
  }
})


export type TModalHeader = {
  id: string
  onClose: () => void
}

const ModalHeader: FC<TModalHeader> = ({children, onClose, ...other}) => {
  return (
    <ThemeProvider theme={theme}>
      <DialogTitle sx={{m: 0, p: 2}} {...other}>
        {children}
        {onClose && (
          <IconButton
            aria-label="close"
            edge={"start"}
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 0,
              top: 20,
              color: (theme => theme.palette.grey[500])
            }}
          >
            <CloseIcon style={{padding: 0}}/>
          </IconButton>
        )}
      </DialogTitle>
    </ThemeProvider>
  );
};

export default ModalHeader;
