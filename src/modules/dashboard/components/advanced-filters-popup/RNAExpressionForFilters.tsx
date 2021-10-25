import React from 'react'
import style from './AdvancedFilters.module.scss'
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import CustomCheckbox from "shared/components/CustomCheckbox";

export const RNAExpressionForFilters = (({ ...rest }) => {
  return (
    <label className={style.checkboxLabel}>
      <div className="include-expressions__label">
        Enable RNA expression for filters
        <InfoIcon
          height={28} width={28}
          title="Include expressions (RNA) data in your filters, off by default.
            Exporting data can take some time. Whilst we have broad coverage of most protein-coding genes,
            some genes may be absent in results due to low expression levels."
        />
      </div>
      <CustomCheckbox
        checked={rest.includeExpressions}
        onChange={rest.toggleIncludeExpressions}
        name={rest.name || 'custom-checkbox'}
      />
    </label>
  )
})