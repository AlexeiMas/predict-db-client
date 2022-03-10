import React from 'react';
import DialogContent from "@mui/material/DialogContent"
import Paper from "@mui/material/Paper"
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Avatar, Box, Grid, styled, Typography} from "@mui/material"

const THEME = createTheme({
  typography: {
    allVariants: {
      fontFamily: "inherit"
    },
    h5: {
      fontWeight: 500,
      lineHeight: '3rem'
    },
    body1: {
      color: '#656790'
    }
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          margin: '0 auto',
          height: '50px',
          width: '50px'
        }
      },
      defaultProps: {
        variant: "rounded"
      }
    }
  }
})

const Item = styled(Paper)(({theme}) => ({
  textAlign: 'center',
  padding: '2rem',
  cursor: 'pointer'
}))

const ModalBody = () => {
  return (
    <DialogContent dividers>
      <ThemeProvider theme={THEME}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/Summary.svg"} />
              <Typography variant={"h5"} component={"h5"}>Summary info</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/Violin.svg"} />
              <Typography variant={"h5"} component={"h5"}>Violin plot</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/Scatter.svg"} />
              <Typography variant={"h5"} component={"h5"}>Scatter plot</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/Heatmap.svg"} />
              <Typography variant={"h5"} component={"h5"}>Heatmap</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/Oncoprint.svg"} />
              <Typography variant={"h5"} component={"h5"}>Oncoprint</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/Lollipop.svg"} />
              <Typography variant={"h5"} component={"h5"}>Lollipop plot</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Avatar alt="Remy Sharp" src={"/assets/images/plotAvatars/BarCharts.svg"} />
              <Typography variant={"h5"} component={"h5"}>Bar charts</Typography>
              <Typography variant={"body1"} component={"p"}>Create a List view using tasks from any location</Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
      </ThemeProvider>
    </DialogContent>
  );
};

export default ModalBody;
