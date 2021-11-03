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
import { useHistory } from 'react-router-dom';

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
  const history = useHistory()
  const { selectedElement, filters } = props;
  const [tabIndex, setTabIndex] = React.useState(0);


  const handleChange = (event: any, newValue: any) => {
    setTabIndex(newValue);
  };

  const isGeneFilterUsed = filters.geneType.genes.length > 0
    || filters.geneType.aliases.length > 0
    || filters.geneType.proteins.length > 0;

  const wait = (timeout: number): Promise<any> => new Promise(r => setTimeout(r, timeout))

  const makePath = () => {
    let canceled = false;
    const cancel = ((args: any) => { canceled = true });

    const changeHistory = (index: number) => {
      const TABS_INDEXES_MAP: { [key: number]: string } = {
        0: 'General'.split(/\s+/).join("_"),
        1: 'Clinical'.split(/\s+/).join("_"),
        2: 'Patient treatment history'.split(/\s+/).join("_"),
        3: 'PDC Model Treatment Responses'.split(/\s+/).join("_"),
        4: 'NGS'.split(/\s+/).join("_"),
      }

      if (props.selectedElement?.pdcModel.trim()) {
        const search = new URLSearchParams()
        const TAB_NAME = TABS_INDEXES_MAP[Number(index)]
        const Model_ID = props.selectedElement.pdcModel.trim()
        search.append("Model_ID", Model_ID)
        search.append('tab', TAB_NAME)
        history.push({
          pathname: 'model',
          search: `?${search}`,
          state: { isDrawerOpened: true, selectedElement: props.selectedElement }
        })
      }
    }

    wait(10).then(() => canceled || changeHistory(tabIndex))
    return cancel;
  }

  React.useEffect(() => {
    const cancel = makePath()
    return () => { cancel('unmounted') }
  }, [tabIndex]) // eslint-disable-line


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
