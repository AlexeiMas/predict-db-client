import React from "react";
interface MarkProps {
  mark: 'P' | 'S';
}

const TumourMark = (props: MarkProps): JSX.Element => {
  return (
    <div style={{
      width: 16,
      height: 16,
      backgroundColor: '#0941AC',
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    }}> {props.mark} </div>
  );
};

export default TumourMark;
