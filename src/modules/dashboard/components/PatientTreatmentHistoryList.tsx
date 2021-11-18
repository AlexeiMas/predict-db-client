import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import React, { useEffect, useState } from "react";
import { getHistoryDetails } from "../../../api/detail.api";
import dataTransformer from "../../../services/data-transformer.service";
import Preloader from "../../../shared/components/Preloader";
import { PatientTreatmentHistoryModel } from "../../../shared/models/patient-treatment-history.model";
import InfoIcon from "shared/components/Icons/InfoIcon";

interface PatientTreatmentHistoryListProps {
  selectedElement: ClinicalSampleModel;
}

const PatientTreatmentHistoryList = ({
  selectedElement,
}: PatientTreatmentHistoryListProps): JSX.Element => {
  const [preloader, togglePreloader] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState(
    [] as PatientTreatmentHistoryModel[]
  );

  useEffect(() => {
    loadPatientTreatmentHistoryInfo();
  }, []); // eslint-disable-line

  const loadPatientTreatmentHistoryInfo = async (): Promise<void> => {
    try {
      togglePreloader(true);
      const { data } = await getHistoryDetails(selectedElement.pdcModel);
      const transformedData =
        dataTransformer.transformPatientTreatmentHistoryToFrontEndFormat(
          data.rows
        );
      setTreatmentHistory(transformedData);
    } catch (e) {
      console.log(e);
    } finally {
      togglePreloader(false);
    }
  };

  const responseBox = (value?: string): JSX.Element => {
    if (value) {
      switch (value) {
        case "CR":
          return <div className="box positive-box">{value}</div>;
        case "SD":
        case "PD":
          return <div className="box negative-box">{value}</div>;
        case "PR":
          return <div className="box intermediate-box">{value}</div>;
      }
    }

    return <>-</>;
  };

  return (
    <>
      {preloader && <Preloader />}
      {!preloader && treatmentHistory && !treatmentHistory.length && (
        <div className="empty">
          <h1 className="empty__title">No results found</h1>
          <div className="empty__text">No patient treatment history available.</div>
        </div>
      )}
      {treatmentHistory.map(
        (history: PatientTreatmentHistoryModel, index: number) => (
          <div className="history-blocks" key={index}>
            <div className="history-blocks__title">
              {history.treatment}
              <InfoIcon title={history.treatment}/>
            </div>

            <div className="history-blocks-content">
              <div className="history-item">
                <div className="history-item-col">
                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Pre/post collection
                      <InfoIcon title="Pre/post collection"/>
                    </div>
                    <div className="history-item__value">
                      {history.prePostCollection}
                    </div>
                  </div>

                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Regime
                      <InfoIcon title="Regime"/>
                    </div>
                    <div className="history-item__value">{history.regime}</div>
                  </div>
                </div>
              </div>

              <div className="history-item">
                <div className="history-item-col">
                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Dose
                      <InfoIcon title="Dose"/>
                    </div>
                    <div className="history-item__value">{history.dose}</div>
                  </div>

                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Treatment duration (months)
                      <InfoIcon title="Treatment duration"/>
                    </div>
                    <div className="history-item__value">
                      {history.treatmentDurationMonths}
                    </div>
                  </div>
                </div>
              </div>

              <div className="history-item">
                <div className="history-item-col">
                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Date started
                      <InfoIcon title="Date started"/>
                    </div>
                    <div className="history-item__value">
                      {history.dateStarted}
                    </div>
                  </div>

                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Date of last treatment
                      <InfoIcon title="Date of last treatment"/>
                    </div>
                    <div className="history-item__value">
                      {history.dateOfLastTreatment}
                    </div>
                  </div>
                </div>
              </div>

              <div className="history-item">
                <div className="history-item-col">
                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Best Response (RECIST)
                      <InfoIcon title="Best Response (RECIST)"/>
                    </div>
                    <div className="history-item__value">
                      {responseBox(history.bestResponseRecist)}
                    </div>
                  </div>

                  <div className="history-item-col-info">
                    <div className="history-item__label">
                      Response Duration
                      <InfoIcon title="Response Duration"/>
                    </div>
                    <div className="history-item__value">
                      {history.responseDurationMonths}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default PatientTreatmentHistoryList;
