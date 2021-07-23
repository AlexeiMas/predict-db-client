import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GeneralInformationList from "./GeneralInformationList";
import ClinicalInformationList from "./ClinicalInformationList";
import PatientTreatmentHistoryList from "./PatientTreatmentHistoryList";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import PDCModelTreatmentResponsesList from "./PDCModelTreatmentResponsesList";
import { FilterModel } from 'shared/models/filters.model';
import NgsList from "./NgsList";

function DashboardDrawerTab(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface DashboardDrawerTabProps {
  selectedElement: ClinicalSampleModel;
  filters: FilterModel;
}

const DashboardDrawerTabs = (props: DashboardDrawerTabProps) => {
  const { selectedElement, filters } = props;
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setTabIndex(newValue);
  };

  const isGeneFilterUsed = filters.geneType.genes.length > 0
    || filters.geneType.aliases.length > 0
    || filters.geneType.proteins.length > 0;

  return (
    <>
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleChange}>
          <Tab label="General" id="simple-tab-0" />
          <Tab label="Clinical" id="simple-tab-1" />
          <Tab label="Patient treatment history" id="simple-tab-2" />
          <Tab label="PDC Model Treatment Responses" id="simple-tab-3" />
          {isGeneFilterUsed && <Tab label="NGS" id="simple-tab-4" />}
        </Tabs>
      </AppBar>
      <DashboardDrawerTab value={tabIndex} index={0}>
        <GeneralInformationList selectedElement={selectedElement} />
      </DashboardDrawerTab>
      <DashboardDrawerTab value={tabIndex} index={1}>
        <ClinicalInformationList selectedElement={selectedElement} />
      </DashboardDrawerTab>
      <DashboardDrawerTab value={tabIndex} index={2}>
        <PatientTreatmentHistoryList selectedElement={selectedElement} />
      </DashboardDrawerTab>
      <DashboardDrawerTab value={tabIndex} index={3}>
        <PDCModelTreatmentResponsesList
          selectedElement={selectedElement}
          filters={filters.tumourType}
        />
      </DashboardDrawerTab>
      {isGeneFilterUsed && <DashboardDrawerTab value={tabIndex} index={4}>
        <NgsList
          selectedElement={selectedElement}
          filters={filters.geneType}
        />
      </DashboardDrawerTab>}
    </>
  );
};

export default DashboardDrawerTabs;
