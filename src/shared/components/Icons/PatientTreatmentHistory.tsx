import CustomTooltip from "../CustomTooltip";

interface PatientTreatmentHistoryIconProps {
  isActive: boolean;
}

function PatientTreatmentHistoryIcon(
  props: PatientTreatmentHistoryIconProps
): JSX.Element {
  const { isActive } = props;
  return (
    <CustomTooltip title="Patient Treatment History">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 2.5V8H19.5M8 17H16M8 14H16M4 2V22H20V7L15 2H4Z"
          stroke={isActive ? "#0941AC" : "#D7D7E2"}
          strokeWidth="1.2"
        />
      </svg>
    </CustomTooltip>
  );
}

export default PatientTreatmentHistoryIcon;
