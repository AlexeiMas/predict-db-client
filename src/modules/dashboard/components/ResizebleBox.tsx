import React from 'react';
import { ResizableBox as ReactResizableBox } from "react-resizable";

import "../../../main.style.css"
import "react-resizable/css/styles.css";

const ResizebleBox = ({
  children,
  width = 900,
  height = 500,
  resizable = true,
  className = ''
}) => {

  return (
    <div>
      {
        resizable ? (
          <ReactResizableBox width={width} height={height}>
            {/*<div style={{width: '100%', height: '100%'}} className={className}>*/}
              { children }
            {/*</div>*/}
          </ReactResizableBox>
        ) : (
          <div>Not a resizable</div>
        )
      }
    </div>
  );
};

export default ResizebleBox;