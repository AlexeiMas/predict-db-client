import React, {useCallback} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ChildModalWindow from "./ChildModalWindow";

const  ModalWindow = ({open, handleOpen}) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const handleClose = useCallback(() => {
      handleOpen(false)
    }, [open],
  );

  return (
      <Modal open={open}
             onClose={handleClose}
      >
        <Box sx={{...style, width: 400 }}>
          <h2>Simple parent modal text</h2>
          <ChildModalWindow style={style} />
        </Box>
      </Modal>
  );
};

export default ModalWindow;
