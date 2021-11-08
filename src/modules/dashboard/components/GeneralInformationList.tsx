import React, { useEffect, useState } from "react";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { getGeneralDetails } from "../../../api/detail.api";
import Preloader from "../../../shared/components/Preloader";
import { ClinicalGeneralInformationModel } from "../../../shared/models/clinical-general-information.model";

import dataTransformer from "../../../services/data-transformer.service";
import InfoIcon from '../../../shared/components/Icons/InfoIcon';
import { useQuery } from '../pages/Dashboard';
import { useHistory } from 'react-router-dom';

interface GeneralInformationListProps {
  selectedElement: ClinicalSampleModel;
}

const GeneralInformationList = ({
  selectedElement,
}: GeneralInformationListProps): JSX.Element => {
  const history = useHistory()
  const [preloader, togglePreloader] = useState(true);
  const [generalInfo, setGeneralInfo] = useState(
    null as unknown as ClinicalGeneralInformationModel
  );

  const query = useQuery()

  const UNMOUNTED = 'unmounted'
  const NOT_FOUND = 'Not found';
  const logReason = (reason: any) => reason === UNMOUNTED || console.log('[ reason ]', reason);

  const loadGeneralInfo = () => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; logReason(reason) })

    const setState = (data: any) => {
      if (data === NOT_FOUND) return history.push('/not-found')
      const transformedData =
        dataTransformer.transformGeneralInformationToFrontEndFormat(data);
      return canceled || setGeneralInfo(transformedData);
    }

    if (!canceled) {
      const ModelID = query.get("Model_ID") as string;
      getGeneralDetails(ModelID)
        .then(success => canceled || success.data)
        .then(success => canceled || !success || setState(success))
        .catch(cancel)
        .finally(() => canceled || togglePreloader(false))
    }

    return cancel;
  };


  useEffect(() => {
    const cancel = loadGeneralInfo();
    return () => { cancel(UNMOUNTED) }
  }, []); // eslint-disable-line


  const hlaA =
    generalInfo &&
    generalInfo.hla &&
    generalInfo.hla.filter((i) => i.includes("A"));
  const hlaB =
    generalInfo &&
    generalInfo.hla &&
    generalInfo.hla.filter((i) => i.includes("B"));
  const hlaC =
    generalInfo &&
    generalInfo.hla &&
    generalInfo.hla.filter((i) => i.includes("C"));

  return (
    <>
      {preloader && <Preloader />}
      {!preloader && !generalInfo && <div> No Data. </div>}
      {!preloader && generalInfo && (
        <>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Model Status</div>
            <div className="drawer-tabs-row__value">
              {generalInfo.modelStatus}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Growth Characteristic
              <InfoIcon title="Growth Characteristic" />
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.growthCharacteristics}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              3D model status
              <InfoIcon title="3D model status" />
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.modelStatus3D}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Patient sequential models
              <InfoIcon title="Patient sequential models" />
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.patientSequentialModels}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Confirmed protein expression
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.confirmedProteinExpression}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">NGS</div>
            <div className="drawer-tabs-row__value">{generalInfo.ngs}</div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Microsatelite status
              <InfoIcon title="Microsatelite status" />
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.microsateliteStatus}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Tumour mutation burden status
              <InfoIcon title="Tumour mutation burden status" />
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.tumourMutationBurdenStatus}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              HLA Typing
              <InfoIcon title="HLA Typing" />
            </div>
            <div className="drawer-tabs-row__set">
              <div className="drawer-tabs-row__value hla">
                {hlaA.map((value, index) => (
                  <div className="drawer-tabs-row__square" key={index}>
                    {value}
                  </div>
                ))}
              </div>

              <div className="drawer-tabs-row__value hla">
                {hlaB.map((value, index) => (
                  <div className="drawer-tabs-row__square" key={index}>
                    {value}
                  </div>
                ))}
              </div>
              <div className="drawer-tabs-row__value hla">
                {hlaC.map((value, index) => (
                  <div className="drawer-tabs-row__square" key={index}>
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Has patient treatment history
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.hasPatientTreatmentHistory}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Has NGS data</div>
            <div className="drawer-tabs-row__value">
              {generalInfo.hasNGSData}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Has PredictRx response data
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.hasResponseData}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Has growth characteristics
            </div>
            <div className="drawer-tabs-row__value">
              {generalInfo.hasGrowthCharacteristics}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GeneralInformationList;
