import CustomTooltip from "../CustomTooltip";

interface PDCTreatmentResponsesIconProps {
  isActive: boolean;
}

function PDCTreatmentResponsesIcon(
  props: PDCTreatmentResponsesIconProps
): JSX.Element {
  const { isActive } = props;
  return (
    <CustomTooltip title="PDC Model Treatment Responses">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 14V20H7V14H3Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
        />
        <path
          d="M10 4V20H14V4H10Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
        />
        <path
          d="M17 9V20H21V9H17Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
        />
      </svg>
    </CustomTooltip>
  );
}

export default PDCTreatmentResponsesIcon;
