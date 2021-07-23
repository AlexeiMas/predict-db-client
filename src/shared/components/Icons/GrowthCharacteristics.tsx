import CustomTooltip from "../CustomTooltip";

interface GrowthCharacteristicsIconProps {
  isActive: boolean;
}

function GrowthCharacteristicsIcon(
  props: GrowthCharacteristicsIconProps
): JSX.Element {
  const { isActive } = props;
  return (
    <CustomTooltip title="Growth Characteristics">
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
          d="M1.60015 11.9999C1.60015 6.25614 6.25638 1.5999 12.0001 1.5999C17.7439 1.5999 22.4001 6.25614 22.4001 11.9999C22.4001 17.7437 17.7439 22.3999 12.0001 22.3999C6.25638 22.3999 1.60015 17.7437 1.60015 11.9999ZM12.0001 0.399902C5.59364 0.399902 0.400146 5.5934 0.400146 11.9999C0.400146 18.4064 5.59364 23.5999 12.0001 23.5999C18.4067 23.5999 23.6001 18.4064 23.6001 11.9999C23.6001 5.5934 18.4067 0.399902 12.0001 0.399902ZM4.6 11.9999C4.6 7.91303 7.91309 4.59994 12 4.59994C16.0869 4.59994 19.4 7.91303 19.4 11.9999C19.4 13.396 19.014 14.7 18.3432 15.8132L19.3711 16.4326C20.1513 15.1377 20.6 13.6203 20.6 11.9999C20.6 7.25029 16.7496 3.39994 12 3.39994C7.25035 3.39994 3.4 7.25029 3.4 11.9999C3.4 16.7496 7.25035 20.5999 12 20.5999C13.6541 20.5999 15.2009 20.1324 16.5132 19.3219L15.8826 18.3009C14.7543 18.9977 13.4251 19.3999 12 19.3999C7.91309 19.3999 4.6 16.0868 4.6 11.9999ZM15 14.9999C15 15.5522 14.5523 15.9999 14 15.9999C13.4477 15.9999 13 15.5522 13 14.9999C13 14.4477 13.4477 13.9999 14 13.9999C14.5523 13.9999 15 14.4477 15 14.9999ZM7.06359 11.0139C6.76907 12.113 7.42137 13.2429 8.52055 13.5374C9.61973 13.8319 10.7496 13.1796 11.0441 12.0804C11.1185 11.8025 11.4042 11.6376 11.6821 11.7121C12.7812 12.0066 13.9111 11.3543 14.2056 10.2551C14.5001 9.15596 13.8478 8.02613 12.7486 7.73161C10.2724 7.0681 7.7271 8.53761 7.06359 11.0139ZM8.83113 12.3783C8.37211 12.2553 8.09971 11.7835 8.2227 11.3244C8.71468 9.48836 10.602 8.39874 12.438 8.89072C12.8971 9.01371 13.1695 9.48553 13.0465 9.94455C12.9235 10.4036 12.4517 10.676 11.9926 10.553C11.0746 10.307 10.131 10.8518 9.88497 11.7698C9.76197 12.2289 9.29016 12.5013 8.83113 12.3783Z"
          fill={isActive ? "#0941AC" : "#D7D7E2"}
        />
      </svg>
    </CustomTooltip>
  );
}

export default GrowthCharacteristicsIcon;
