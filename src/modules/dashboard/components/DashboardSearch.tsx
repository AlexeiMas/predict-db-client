import {
  ArrowUpIcon,
  ExportIcon,
  FilterIcon,
} from "../../../shared/components/Icons";
import { Button, createStyles, makeStyles } from "@material-ui/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import ArrowDownIcon from "../../../shared/components/Icons/ArrowDownIcon";
import { FilterModel } from "shared/models/filters.model";
import GeneFilter from "./filters/GeneFilter";
import { exportData } from "../../../api/export.api";
import CustomTooltip from "shared/components/CustomTooltip";

interface DashboardSearchProps {
  toggleFilter: (value: boolean) => void;
  resultsLength: number;
  areFiltersOpened: boolean;
  filters: FilterModel;
  setFilters: Dispatch<SetStateAction<FilterModel>>;
  areFiltersCleared: boolean;
  setAreFiltersCleared: Dispatch<SetStateAction<boolean>>;
  togglePreloader: Dispatch<SetStateAction<boolean>>;
}

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      marginLeft: "10px",
      borderRadius: "8px",
      padding: "7px",
      flex: 1,
    },
    button: {
      backgroundColor: "#0941AC",
      color: "white",
      padding: "10px",

      "&:hover": {
        backgroundColor: "#0941AC",
      },
    },
    filterButton: {
      border: "1.2px solid rgba(9, 65, 172, 0.5);",
      backgroundColor: "rgba(9, 65, 172, 0.05)",
      color: "#0941AC",
      padding: "10px",

      "&:hover": {
        backgroundColor: "rgba(9, 65, 172, 0.05)",
        color: "#0941AC",
      },
    },
  })
);

const DashboardSearch = ({
  resultsLength,
  toggleFilter,
  areFiltersOpened,
  filters,
  setFilters,
  areFiltersCleared,
  setAreFiltersCleared,
  togglePreloader,
}: DashboardSearchProps): JSX.Element => {
  const [exportDisabled, setExportDisabled] = useState(false);

  const classes = useStyles();

  const exportClickHandler = async () => {
    setExportDisabled(true);
    togglePreloader(true);

    const success = await exportData(filters);

    if (success) {
      setExportDisabled(false);
      togglePreloader(false);
    }
  };

  return (
    <form className="search">
      <h1 className="search__title results">Results: {resultsLength}</h1>
      <div className="search__input">
        <GeneFilter
          setFilters={setFilters}
          filters={filters}
          isClearFilter={areFiltersCleared}
          setIsClearFilter={setAreFiltersCleared}
        />
      </div>
      <div className="search__button">
        <button
          className="btn btn-outlined search__filter-btn"
          onClick={() => toggleFilter(!areFiltersOpened)}
        >
          <FilterIcon />
          <span>Filters</span>{" "}
          {areFiltersOpened ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </button>
      </div>
      <CustomTooltip
        title={
          'NGS data available via export. You must select a valid "Tumour Type" to get Treatment Response data.'
        }
      >
        <div className="search__button">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ExportIcon />}
            className={classes.button}
            disabled={exportDisabled}
            onClick={() => exportClickHandler()}
          >
            Export data
          </Button>
        </div>
      </CustomTooltip>
    </form>
  );
};

export default DashboardSearch;
