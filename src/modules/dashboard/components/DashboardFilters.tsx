import React, { Dispatch, SetStateAction } from "react";
import TumourTypeFilter from "./filters/TumourTypeFilter";
import {
  FilterModel,
  ResponsesFilterModel,
  TumourFilterModel,
  PatientTreatmentHistoryFilterModel,
} from "../../../shared/models/filters.model";
import ResponsesFilter from "./filters/ResponsesFilter";
import ModelFilter from "./filters/ModelFilter";
import HistoryTypeFilter from "./filters/HistoryFilter";
import { Button, createStyles, makeStyles } from "@material-ui/core";
import CloseIcon from "shared/components/Icons/CloseIcon";
import DataAvailableFilter from './filters/DataAvailableFilter'
import AdvancedFilters from './advanced-filters-popup'
import { useAdvancedFiltersContext } from '../../../context/advanced-filters.context';

interface DashboardFiltersProps {
  filters: FilterModel;
  setFilters: Dispatch<SetStateAction<FilterModel>>;
  opened: boolean;
  areFiltersCleared: boolean;
  setAreFiltersCleared: Dispatch<SetStateAction<boolean>>;
}

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      backgroundColor: "#EEEEF2",
      color: "#656790",
      borderRadius: "8px",

      "&:hover": {
        backgroundColor: "#EEEEF2",
      },
    },
  })
);

const DashboardFilters = ({
  filters,
  setFilters,
  opened,
  areFiltersCleared,
  setAreFiltersCleared,
}: DashboardFiltersProps): JSX.Element => {
  const classes = useStyles();
  const context = useAdvancedFiltersContext();

  const clearAllFilters = (): void => {
    setFilters({
      tumourType: [
        {
          primary: [],
          sub: [],
        },
      ],
      historyType: [
        {
          treatment: [],
          response: [],
        },
      ],
      responsesType: [
        {
          treatment: [],
          response: [],
        },
      ],
      modelType: [],
      geneType: {
        genes: [],
        aliases: [],
        proteins: [],
        includeExpressions: false,
      },
      dataAvailable: [],
    } as FilterModel);
    setAreFiltersCleared(true);
    context.clearAdvancedFilters()
  };

  const callbackToUpdateFilters = (callbackFilters: any) => setFilters(callbackFilters)

  return (
    <div className={"dashboard-filters " + (opened ? "opened" : "")}>
      <div className="dashboard-filters-title">
        <h1 className="search__title">Filters</h1>

        <div className="search__clear">
          <Button
            variant="text"
            color="primary"
            startIcon={<CloseIcon close={() => { }} />}
            className={classes.button}
            onClick={() => clearAllFilters()}
          >
            Clear all filters
          </Button>
          <AdvancedFilters
            setFilters={setFilters}
            filters={filters}
            isClearFilter={areFiltersCleared}
            setIsClearFilter={setAreFiltersCleared}

            callbackToUpdateFilters={callbackToUpdateFilters}
            target={document.getElementById('MANUAL_FILTERS_TARGET_ELEMENT')}
          />
        </div>
      </div>

      <div className="dashboard-filters-content">

        <div className="dashboard-filters__item">
          {filters.tumourType.map(
            (element: TumourFilterModel, index: number) => (
              <div className="dashboard-filters__filter" key={index}>
                <TumourTypeFilter
                  setFilters={setFilters}
                  index={index}
                  filters={filters}
                  isClearFilter={areFiltersCleared}
                  setIsClearFilter={setAreFiltersCleared}
                />
              </div>
            )
          )}
        </div>

        <div className="dashboard-filters__item">
          {filters.historyType.map(
            (element: PatientTreatmentHistoryFilterModel, index: number) => (
              <div className="dashboard-filters__filter" key={index}>
                <HistoryTypeFilter
                  setFilters={setFilters}
                  index={index}
                  filters={filters}
                  isClearFilter={areFiltersCleared}
                  setIsClearFilter={setAreFiltersCleared}
                />
              </div>
            )
          )}
        </div>

        <div className="dashboard-filters__item">
          {filters.responsesType.map(
            (element: ResponsesFilterModel, index: number) => (
              <div className="dashboard-filters__filter" key={index}>
                <ResponsesFilter
                  setFilters={setFilters}
                  index={index}
                  filters={filters}
                  isClearFilter={areFiltersCleared}
                  setIsClearFilter={setAreFiltersCleared}
                />
              </div>
            )
          )}
        </div>

        <div className="dashboard-filters__item">
          <div className="dashboard-filters__filter">
            <ModelFilter
              setFilters={setFilters}
              filters={filters}
              isClearFilter={areFiltersCleared}
              setIsClearFilter={setAreFiltersCleared}
            />
          </div>
        </div>

        <div className="dashboard-filters__item">
          <div className="dashboard-filters__filter">
            <DataAvailableFilter
              setFilters={setFilters}
              filters={filters}
              isClearFilter={areFiltersCleared}
              setIsClearFilter={setAreFiltersCleared}
            ></DataAvailableFilter>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardFilters;
