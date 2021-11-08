import React from "react";

interface CloseIconProps {
  close: () => void;
}

function CloseIcon(props: CloseIconProps): JSX.Element {
  const { close } = props;

  const onClick = (e: any): void => {
    e.stopPropagation();
    close();
  }

  return (
    <svg width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e: any) => onClick(e)}>
      <path
        d="M11.1517 11.9999L6.57593 7.42421L7.42446 6.57568L12.0002 11.1514L16.5759 6.57568L17.4245 7.42421L12.8487 11.9999L17.4245 16.5757L16.5759 17.4242L12.0002 12.8485L7.42446 17.4242L6.57593 16.5757L11.1517 11.9999Z"
        fill="#9B9CB7"
      />
    </svg>
  );
}

export default CloseIcon;