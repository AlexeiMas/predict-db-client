import React from 'react';
import { useAdvancedFiltersContext } from '../../../../context/advanced-filters.context';
export type Name = "tumourType" | "responsesType" | "historyType" | "geneType" | "modelType" | "dataAvailable";
export const NAME_PLACEHOLDERS_MAP = {
  tumourType: "Tumour Type",
  responsesType: "PDC Model Treatment Response",
  historyType: "Patient Treatment History",
  geneType: "Genes",
  modelType: "Model ID",
  dataAvailable: "Data Available",
  includeExpressions: "Enable RNA",
}

export const TextAreaLikeInput = (({ ...rest }) => {
  const name = rest.name.trim() as Name;
  const context = useAdvancedFiltersContext()
  return (
    <label htmlFor={name}>
      <textarea name={name} id={name} value={context[name]} onChange={rest.onChange} placeholder={NAME_PLACEHOLDERS_MAP[name]} />
    </label>
  )
})