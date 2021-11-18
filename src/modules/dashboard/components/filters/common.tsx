import React from 'react';
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";

export const GenesSearchTooltip = (() => {

  return (
    <div className="genes-search-tooltip">
    <InfoIcon
      color="#0941AC"
      title={
        <>
          You can enter up to 20 valid HUGO gene names or UniProt
          IDs, e.g.{" "}
          <a
            className="tooltip-link"
            target="_blank"
            rel="noreferrer"
            href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=BRCA1"
          >
            see aliases
          </a>{" "}
          for BRCA1.
          <br />
          <br />
          Search carried out across mutations, expressions, copy
          number variations and fusions. Only mutations with a COSMIC entry are shown. Contact us for full NGS dataset. Documentation{" "}
          <a
            className="tooltip-link"
            target="_blank"
            rel="noreferrer"
            href="https://docs.imagentherapeutics.com/docs/rnaseq"
          >
            here
          </a>
          .
          <br />
          <br />
          NGS data available via the export function.
        </>
      }
    />
  </div>
  )
})