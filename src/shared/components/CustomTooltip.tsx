import React from 'react';
import Tooltip from "@material-ui/core/Tooltip";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

interface CustomTooltipProps {
  children: React.ReactElement<any, any>;
  title: string | NonNullable<React.ReactNode>;
}

const theme = createTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontFamily: "Exo",
        fontSize: "12px",
        color: "white",
        backgroundColor: "#00003E",
        padding: "10px 14px",
        borderRadius: "8px",
        textAlign: "center",
      },
    },
  },
});

function CustomTooltip(props: CustomTooltipProps) {
  const { children, title } = props;
  return (
    <MuiThemeProvider theme={theme}>
      <Tooltip title={title} placement="top" interactive arrow>
        {children}
      </Tooltip>
    </MuiThemeProvider>
  );
}

export default CustomTooltip;
