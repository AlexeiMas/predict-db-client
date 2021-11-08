import CustomTooltip from "../CustomTooltip";

interface PlasmaIconProps {
  isActive: boolean;
}

function PlasmaIcon(props: PlasmaIconProps): JSX.Element {
  const { isActive } = props;
  return (
    <CustomTooltip title="Plasma">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1729 11.1127C17.0468 13.9717 16.6322 17.7577 14.1839 20.1433V20.1433C11.4105 22.8457 6.98876 22.8457 4.21535 20.1433V20.1433C1.76704 17.7577 1.35244 13.9717 3.22643 11.1127L9.19964 2L15.1729 11.1127Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
          strokeLinejoin="bevel"
        />
        <path
          d="M22.5 13C22.5 16.5899 19.5899 19.5 16 19.5C12.4101 19.5 9.5 16.5899 9.5 13C9.5 9.41015 12.4101 6.5 16 6.5C19.5899 6.5 22.5 9.41015 22.5 13Z"
          fill="white"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
        />
        <path
          d="M12.4 12.4C12.4 13.0627 12.9373 13.6 13.6 13.6C14.2627 13.6 14.8 13.0627 14.8 12.4C14.8 12.0686 15.0686 11.8 15.4 11.8C16.0627 11.8 16.6 11.2627 16.6 10.6C16.6 9.93726 16.0627 9.4 15.4 9.4C13.7431 9.4 12.4 10.7431 12.4 12.4Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M19.6 13.6C19.6 12.9373 19.0627 12.4 18.4 12.4C17.7373 12.4 17.2 12.9373 17.2 13.6C17.2 13.9314 16.9314 14.2 16.6 14.2C15.9373 14.2 15.4 14.7373 15.4 15.4C15.4 16.0627 15.9373 16.6 16.6 16.6C18.2569 16.6 19.6 15.2569 19.6 13.6Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </CustomTooltip>
  );
}

export default PlasmaIcon;
