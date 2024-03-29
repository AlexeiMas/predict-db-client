import CustomTooltip from "../CustomTooltip";

interface NGSIconProps {
  isActive: boolean;
}

function NGSIcon(props: NGSIconProps): JSX.Element {
  const { isActive } = props;
  return (
    <CustomTooltip title="NGS">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.3999 19.1587V22H6.5999V21.6H14.3999V20.4H6.5999V19.1587C6.5999 18.971 6.60966 18.7845 6.62883 18.6H14.3999V17.4H6.89426C7.28078 16.2783 8.03219 15.298 9.05444 14.6328L10.0861 13.9614L8.995 13.2397L8.39989 13.627C6.52864 14.8448 5.3999 16.9261 5.3999 19.1587ZM15.5999 10.373L15.0048 10.7603L13.9137 10.0386L14.9454 9.36724C15.9676 8.70197 16.719 7.72175 17.1055 6.6H9.5999V5.4H17.371C17.3901 5.21549 17.3999 5.02904 17.3999 4.84128V3.6H9.5999V2.4H17.3999V2H18.5999V4.84128C18.5999 7.07392 17.4712 9.15521 15.5999 10.373ZM5.3999 2V4.84129C5.3999 7.07392 6.52864 9.15521 8.39989 10.373L14.9454 14.6328C16.4764 15.6291 17.3999 17.332 17.3999 19.1587V22H18.5999V19.1587C18.5999 16.9261 17.4712 14.8448 15.5999 13.627L9.05444 9.36724C7.52341 8.37086 6.5999 6.66799 6.5999 4.84129V2H5.3999Z"
          fill={isActive ? "#0941AC" : "#D7D7E2"}
        />
      </svg>
    </CustomTooltip>
  );
}

export default NGSIcon;
