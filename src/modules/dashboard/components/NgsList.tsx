import React, { useEffect, useState } from "react";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { getNgsDetails } from "../../../api/detail.api";
import Preloader from "../../../shared/components/Preloader";
import { ApiNgsModel } from '../../../shared/models/api/api-ngs.model';
import { GenesFilterModel } from "shared/models/filters.model";
import { GeneAliasIcon, GeneIcon, ProteinIcon } from "shared/components/Icons";
import InfoIcon from "shared/components/Icons/InfoIcon";

interface MutationsListProps {
  selectedElement: ClinicalSampleModel;
  filters: GenesFilterModel;
}

const MutationsList = ({
  selectedElement,
  filters,
}: MutationsListProps): JSX.Element => {
  const [preloader, togglePreloader] = useState(false);
  const [ngs, setNgs] = useState(
    null as unknown as ApiNgsModel
  );

  useEffect(() => {
    loadNgsData();
  }, []); // eslint-disable-line

  const loadNgsData = async (): Promise<void> => {
    try {
      togglePreloader(true);
      const { data } = await getNgsDetails(selectedElement.pdcModel, filters);
      setNgs(data);
    } catch (e) {
      console.log(e);
    } finally {
      togglePreloader(false);
    }
  };

  return (
    <>
      {preloader && <Preloader />}
      {!preloader && ngs && (
        <div className="ngs-mutations">
          <div className="ngs-mutations__title">
            <span>Gene symbols</span>
            <InfoIcon title="Indicates the genes found for this model inside any of the 4 NGS data sets - DNA, RNA, CNV, Fusions" />
          </div>
          <div className="ngs-mutations__tags">
            {ngs.genes.length > 0 && ngs.genes.map((value, index) => (
              <div className="ngs-mutations__tag" key={index}>
                <GeneIcon/>
                <span>{value}</span>
              </div>
            ))}
            {ngs.aliases.length > 0 && ngs.aliases.map((value, index) => (
              <div className="ngs-mutations__tag" key={index}>
                <GeneAliasIcon/>
                <span>{value}</span>
              </div>
            ))}
            {ngs.proteins.length > 0 && ngs.proteins.map((value, index) => (
              <div className="ngs-mutations__tag" key={index}>
                <ProteinIcon/>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MutationsList;
