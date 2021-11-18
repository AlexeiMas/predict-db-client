import CustomTooltip from '../CustomTooltip';

interface InfoIconProps {
  title: string | NonNullable<React.ReactNode>;
  color?: string;
}

const InfoIcon = (props: InfoIconProps): JSX.Element => {
  const { title, color = '#9B9CB7' } = props;
  return (
    <CustomTooltip title={title}>
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
          d="M12 17.8C15.2033 17.8 17.8 15.2033 17.8 12C17.8 8.79675 15.2033 6.2 12 6.2C8.79675 6.2 6.2 8.79675 6.2 12C6.2 15.2033 8.79675 17.8 12 17.8ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12.6 11V16H11.4V11H12.6ZM12.75 10V8.5H11.25V10H12.75Z"
          fill={ color }
        />
      </svg>
    </CustomTooltip>
  );
};

export default InfoIcon;
