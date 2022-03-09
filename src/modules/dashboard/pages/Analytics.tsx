import React, {FC, useState} from 'react';
import Preloader from '../../../shared/components/Preloader'
import OncoChart from "../components/oncoPrint";
import {Stack, Button} from "@mui/material";
import ModalWindow from "../components/modalWindow/ModalWindow";
import Draggable from 'react-draggable';
import ResizebleBox from "../components/ResizebleBox";

const Analytics: FC = () => {

  const [preloader, togglePreloader] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  setTimeout(() => {
    togglePreloader(false)
  }, 1000)

  return (
    <div className="dash-board">
      {preloader && <Preloader/>}
      <div>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button variant="outlined" color="primary">Reset</Button>
          <Button variant="outlined" color="primary">Export plots (PDF)</Button>
          <Button variant="contained" color="primary" onClick={handleOpen}>Add Plot</Button>
        </Stack>
      </div>
      <ModalWindow open={open} handleOpen={setOpen}/>
      <div id="test" style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <Draggable cancel=".draglayer, .rangeslider-container, .legend, .modebar, .react-resizable-handle">
          <div style={{width: '50%', padding: '0 5px'}}>
            <ResizebleBox>
              <OncoChart />
            </ResizebleBox>
          </div>
        </Draggable>
        <Draggable cancel=".draglayer, .rangeslider-container, .legend, .modebar, .react-resizable-handle">
          <div style={{width: '50%', padding: '0 5px'}}>
            <ResizebleBox>
              <div style={{border: '1px solid black'}}>
                test
              </div>
            </ResizebleBox>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Analytics;
