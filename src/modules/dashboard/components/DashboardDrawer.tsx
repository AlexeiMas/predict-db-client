import React, { Dispatch, SetStateAction } from 'react';

import Drawer from '@material-ui/core/Drawer';
import CloseIcon from "../../../shared/components/Icons/CloseIcon";
import DashboardDrawerTabs from "./DashboardDrawerTabs";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";

import {
  GrowthCharacteristicsIcon,
  NGSIcon,
  PatientTreatmentHistoryIcon,
  PDCTreatmentResponsesIcon,
  PlasmaIcon,
  PBMCIcon,
} from "../../../shared/components/Icons";
import { FilterModel } from 'shared/models/filters.model';

interface DashboardDrawerProps {
  opened: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  selectedElement: ClinicalSampleModel;
  filters: FilterModel;
}

const DashboardDrawer = (props: DashboardDrawerProps): JSX.Element => {
  const { opened, toggle, selectedElement, filters } = props;

  return (
    <div className="drawer">
      <Drawer open={ opened }
              anchor="right"
              onClose={ () => toggle(false) }>
        <div className="drawer-content">

          <div className="drawer-header">
            <span className="drawer__title">Details</span>
            <div className="drawer__close-icon">
              <CloseIcon close={ () => toggle(false) }/>
            </div>
          </div>

          <span className="drawer__model-tip">Model ID</span>
          <span className="drawer__model-title">{ selectedElement.pdcModel }</span>

          <div className="drawer-info-panel">
            <div className="drawer__icons">
              <div className="drawer__icon">
                <NGSIcon isActive={ selectedElement.hasNgsData } />
              </div>
              <div className="drawer__icon">
                <PatientTreatmentHistoryIcon isActive={ selectedElement.hasPatientTreatmentHistory } />
              </div>
              <div className="drawer__icon">
                <PDCTreatmentResponsesIcon isActive={ selectedElement.hasResponseData } />
              </div>
              <div className="drawer__icon">
                <GrowthCharacteristicsIcon isActive={ selectedElement.hasGrowthCharacteristics } />
              </div>
              <div className="drawer__icon">
                <PlasmaIcon isActive={ selectedElement.hasPlasma } />
              </div>
              <div className="drawer__icon">
                <PBMCIcon isActive={ selectedElement.hasPBMC } />
              </div>
            </div>

            <div className="drawer__cta-button">
              <a className="btn btn-outlined" href={`mailto:predictdb@imagentherapeutics.com?subject=${selectedElement.pdcModel}`}>Get in touch about this model</a>
            </div>
          </div>

          <DashboardDrawerTabs selectedElement={selectedElement} filters={filters} />
        </div>
      </Drawer>
    </div>
  );
}

export default DashboardDrawer;