import React, { Dispatch, SetStateAction } from 'react';

import Drawer from '@material-ui/core/Drawer';
import CloseIcon from "../../../shared/components/Icons/CloseIcon";
import DashboardDrawerTabs from "./DashboardDrawerTabs";

import {
  GrowthCharacteristicsIcon,
  NGSIcon,
  PatientTreatmentHistoryIcon,
  PDCTreatmentResponsesIcon,
  PlasmaIcon,
  PBMCIcon,
} from "../../../shared/components/Icons";
import { useDrawlerCtx } from '../../../context/drawler.context';
import { searchItems } from 'api/search.api';
import dataTransformer from "../../../services/data-transformer.service";
import { useQuery } from '../pages/Dashboard';
import Preloader from '../../../shared/components/Preloader';

interface DashboardDrawerProps {
  opened: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  getRecords: () => void;
}

const DashboardDrawer = (props: DashboardDrawerProps): JSX.Element => {
  const drawlerCTX = useDrawlerCtx();
  const isEmpty = (obj: any) => obj.constructor === Object && Object.keys(obj).length === 0;
  const query = useQuery();
  const Model_ID = query.get("Model_ID")
  const [selfOpened, setOpened] = React.useState(false);

  const UNMOUNTED = 'unmounted'
  const logReason = (reason: any) => {
    if (reason === UNMOUNTED) return;
    console.log('[ reason ]', reason);
  }

  const loadSelectedItem = () => {
    let canceled = !isEmpty(drawlerCTX.state.selectedElement);
    setOpened(canceled)
    const cancel = ((reason: any) => { canceled = true; logReason(reason) })


    const setState = (data: any) => {
      const transformedData = dataTransformer.transformSamplesToFrontEndFormat(
        data.rows
      );
      const element = transformedData.find(e => e.pdcModel === Model_ID)
      if (element) drawlerCTX.controls.updateSelectedElement(element)
    }

    if (!canceled) {
      const filters = { ...drawlerCTX.state.filters, ...(Model_ID && { modelType: [Model_ID] }) }
      searchItems(1, 0, filters)
        .then(success => canceled || success.data)
        .then(success => canceled || !success || setState(success))
        .catch(cancel)
        .finally(() => canceled || setOpened(true))
    }

    return cancel;
  }

  React.useEffect(() => {
    const cancel = loadSelectedItem()
    return () => { cancel('unmounted') }
  })

  return (
    <div className="drawer">
      <Drawer open={props.opened}
        anchor="right"
        onClose={() => props.toggle(false)}>
        <div className="drawer-content">

          <div className="drawer-header">
            <span className="drawer__title">Details</span>
            <div className="drawer__close-icon">
              <CloseIcon close={() => props.toggle(false)} />
            </div>
          </div>

          {
            !selfOpened
              ? <Preloader />
              : (
                <>
                  <span className="drawer__model-tip">Model ID</span>
                  <span className="drawer__model-title">{drawlerCTX.state.selectedElement.pdcModel}</span>

                  <div className="drawer-info-panel">
                    <div className="drawer__icons">
                      <div className="drawer__icon">
                        <NGSIcon isActive={drawlerCTX.state.selectedElement.hasNgsData} />
                      </div>
                      <div className="drawer__icon">
                        <PatientTreatmentHistoryIcon isActive={drawlerCTX.state.selectedElement.hasPatientTreatmentHistory} />
                      </div>
                      <div className="drawer__icon">
                        <PDCTreatmentResponsesIcon isActive={drawlerCTX.state.selectedElement.hasResponseData} />
                      </div>
                      <div className="drawer__icon">
                        <GrowthCharacteristicsIcon isActive={drawlerCTX.state.selectedElement.hasGrowthCharacteristics} />
                      </div>
                      <div className="drawer__icon">
                        <PlasmaIcon isActive={drawlerCTX.state.selectedElement.Plasma} />
                      </div>
                      <div className="drawer__icon">
                        <PBMCIcon isActive={drawlerCTX.state.selectedElement.PBMC} />
                      </div>
                    </div>

                    <div className="drawer__cta-button">
                      <a className="btn btn-outlined" href={`mailto:predictdb@imagentherapeutics.com?subject=${drawlerCTX.state.selectedElement.pdcModel}`}>Get in touch about this model</a>
                    </div>
                  </div>

                  <DashboardDrawerTabs selectedElement={drawlerCTX.state.selectedElement} filters={drawlerCTX.state.filters} />
                </>
              )
          }
        </div>
      </Drawer>
    </div>
  );
}

export default DashboardDrawer;