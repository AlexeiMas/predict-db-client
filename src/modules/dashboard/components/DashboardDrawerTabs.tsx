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
import { useQuery } from '../pages/Dashboard';
import { useDrawlerCtx } from "context/drawler.context";

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


const TABS_INDEXES_MAP: { [key: number]: string } = {
  0: 'General'.split(/\s+/).join("_"),
  1: 'Clinical'.split(/\s+/).join("_"),
  2: 'Patient treatment history'.split(/\s+/).join("_"),
  3: 'PDC Model Treatment Responses'.split(/\s+/).join("_"),
  4: 'NGS'.split(/\s+/).join("_"),
}

const DashboardDrawerTabs = (props: DashboardDrawerTabProps) => {
  const history = useHistory()
  const query = useQuery()
  const drawlerCTX = useDrawlerCtx();


  const isGeneFilterUsed = drawlerCTX.state.filters.geneType.genes.length > 0
    || drawlerCTX.state.filters.geneType.aliases.length > 0
    || drawlerCTX.state.filters.geneType.proteins.length > 0;

  const getInitialTabIndex = () => {
    const raw_tab = query.get("tab");
    return Object
      .entries(TABS_INDEXES_MAP)
      .reduce(
        (acc: number, [idx, name]) => {
          if (!isGeneFilterUsed && /ngs/gi.test(name)) return 0
          const re = new RegExp(name, "gi");
          return (raw_tab && re.test(raw_tab)) ? Number(idx) : (acc)
        }, 0)
  }

  const [tabIndex, setTabIndex] = React.useState(getInitialTabIndex);
  const handleChange = (_: any, newValue: any) => { setTabIndex(newValue); };
  const wait = (timeout: number): Promise<any> => new Promise(r => setTimeout(r, timeout))

  const makePath = () => {
    let canceled = false;
    const cancel = ((args: any) => { canceled = true });

    const changeHistory = (index: number) => {
      if ((query.get("Model_ID") || '').trim()) {
        const search = new URLSearchParams()
        const TAB_NAME = TABS_INDEXES_MAP[Number(index)]
        const Model_ID = (query.get("Model_ID") || '').trim()
        search.append("Model_ID", Model_ID)
        search.append('tab', TAB_NAME)
        search.append('show', 'true')
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
        <GeneralInformationList selectedElement={drawlerCTX.state.selectedElement} />
      </DashboardDrawerTab>
      <DashboardDrawerTab value={tabIndex} index={1}>
        <ClinicalInformationList selectedElement={drawlerCTX.state.selectedElement} />
      </DashboardDrawerTab>
      <DashboardDrawerTab value={tabIndex} index={2}>
        <PatientTreatmentHistoryList selectedElement={drawlerCTX.state.selectedElement} />
      </DashboardDrawerTab>
      <DashboardDrawerTab value={tabIndex} index={3}>
        <PDCModelTreatmentResponsesList
          selectedElement={drawlerCTX.state.selectedElement}
          filters={drawlerCTX.state.filters.tumourType}
        />
      </DashboardDrawerTab>
      {isGeneFilterUsed && <DashboardDrawerTab value={tabIndex} index={4}>
        <NgsList
          selectedElement={drawlerCTX.state.selectedElement}
          filters={drawlerCTX.state.filters.geneType}
        />
      </DashboardDrawerTab>}
    </>
  );
};

export default DashboardDrawerTabs;
