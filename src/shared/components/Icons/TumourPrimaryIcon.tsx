import React from "react";

const TumourPrimaryIcon = (): JSX.Element => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="8" fill="#0941AC" />
      <text x="50%" y="50%" textAnchor="middle" stroke="white" strokeWidth={.5} style={{ fontSize: 8, lineHeight: 16, textTransform: 'uppercase' }} dy=".3em" > P </text>
    </svg>
  );
};

export default TumourPrimaryIcon;
