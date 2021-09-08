import React, { useEffect, useState } from "react";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { getClinicalDetails } from "../../../api/detail.api";
import dataTransformer from "../../../services/data-transformer.service";
import Preloader from "../../../shared/components/Preloader";

interface ClinicalInformationListProps {
  selectedElement: ClinicalSampleModel;
}

const ClinicalInformationList = ({
  selectedElement,
}: ClinicalInformationListProps): JSX.Element => {
  const [preloader, togglePreloader] = useState(false);
  const [clinicalInfo, setClinicalInfo] = useState(
    null as unknown as ClinicalSampleModel
  );

  useEffect(() => {
    loadClinicalInfo();
  }, []); // eslint-disable-line

  const loadClinicalInfo = async (): Promise<void> => {
    try {
      togglePreloader(true);
      const { data } = await getClinicalDetails(selectedElement.pdcModel);
      const transformedData =
        dataTransformer.transformSampleToFrontEndFormat(data);
      setClinicalInfo(transformedData);
    } catch (e) {
      console.log(e);
    } finally {
      togglePreloader(false);
    }
  };

  return (
    <>
      {preloader && <Preloader />}
      {!preloader && !clinicalInfo && <div> No Data. </div>}
      {!preloader && clinicalInfo && (
        <>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Sex</div>
            <div className="drawer-tabs-row__value">{clinicalInfo.sex}</div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Age</div>
            <div className="drawer-tabs-row__value">{clinicalInfo.age}</div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Ethnicity</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.ethnicity}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Primary tumour type</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.primaryTumourType}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Subtype</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.tumourSubType}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Histology</div>
            <div className="drawer-tabs-row__value">
                {clinicalInfo.histology}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">
              Receptor Status
            </div>
            <div className="drawer-tabs-row__value">
                {clinicalInfo.ReceptorStatus}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Diagnosis</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.diagnosis}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Stage</div>
            <div className="drawer-tabs-row__value">{clinicalInfo.stage}</div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Differentiation</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.differentiation}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Treatment status</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.treatmentStatus}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Sample site</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.sampleCollectionSite}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Sample type</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.sampleType}
            </div>
          </div>
          <div className="drawer-tabs-row">
            <div className="drawer-tabs-row__label">Smoking history</div>
            <div className="drawer-tabs-row__value">
              {clinicalInfo.smokingHistory}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ClinicalInformationList;
