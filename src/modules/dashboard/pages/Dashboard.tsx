import React from "react";

import DashboardHeader from "../components/DashboardHeader";
import DashboardSearch from "../components/DashboardSearch";
import DashboardDrawer from "../components/DashboardDrawer";
import Preloader from "../../../shared/components/Preloader";
import DashboardTable from "../components/DashboardTable";
import DashboardFilters from "../components/DashboardFilters";

import titleService from "../../../services/title.service";
import dataTransformer from "../../../services/data-transformer.service";

import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { searchItems } from "../../../api/search.api";
import { FilterModel } from "../../../shared/models/filters.model";
import { useHistory } from "react-router-dom";
import { routes } from '../../../routes';

const DashboardPage = ({ ...rest }): JSX.Element => {
  const history = useHistory()
  titleService.setTitle(rest.title);
  const defaultPageSize = 20;

  const [areFiltersOpened, toggleFilter] = React.useState(true);
  const [preloader, togglePreloader] = React.useState(false);

  const [records, setRecords] = React.useState([] as ClinicalSampleModel[]);
  const [count, setCount] = React.useState(0);
  const [sort, setSort] = React.useState("");
  const [order, setOrder] = React.useState("");

  const [areFiltersCleared, setAreFiltersCleared] = React.useState(false);

  const [filters, setFilters] = React.useState({
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
    dataAvailable: []
  } as FilterModel);

  const [selectedPageIndex, setSelectedPage] = React.useState(0);
  const filtersRef = React.useRef<FilterModel>();

  React.useEffect(() => {
    filtersRef.current = filters;
  });

  const prevFilters = filtersRef.current;

  React.useEffect(() => {
    const selectedPage = filters === prevFilters ? selectedPageIndex : 0;
    setSelectedPage(selectedPage);
    if (!preloader) getRecords(selectedPage, defaultPageSize, filters, sort, order);
  }, [filters, selectedPageIndex, sort, order]); // eslint-disable-line

  const getRecords = async (
    pageIndex: number,
    pageSize: number,
    filters: FilterModel,
    sort: string,
    order: string
  ): Promise<void> => {
    try {
      togglePreloader(true);
      const { data } = await searchItems(pageSize, pageIndex, filters, sort, order);
      const transformedData = dataTransformer.transformSamplesToFrontEndFormat(
        data.rows
      );
      setRecords([...transformedData]);
      setCount(data.count);
    } catch (e) {
      console.log(e);
    } finally {
      togglePreloader(false);
    }
  };

  const openDrawer = (selectedElement: ClinicalSampleModel): void => {
    const modelID = selectedElement.pdcModel.trim()
    history.push({ pathname: '/model/' + modelID, state: { isDrawerOpened: true, selectedElement } })
  };

  const toggle = (state: boolean) => {
    history.push({ pathname: routes.dashboard, state: { isDrawerOpened: state } })
  }

  const onToggleFilters = (value: boolean): void => {
    toggleFilter(value);
  };


  return (
    <div className="dash-board">
      {preloader && <Preloader />}

      <DashboardHeader />

      <div className="dash-board__content">
        <DashboardFilters
          filters={filters}
          setFilters={setFilters}
          opened={areFiltersOpened}
          areFiltersCleared={areFiltersCleared}
          setAreFiltersCleared={setAreFiltersCleared}
        />

        <DashboardSearch
          resultsLength={count}
          areFiltersOpened={areFiltersOpened}
          toggleFilter={onToggleFilters}
          filters={filters}
          setFilters={setFilters}
          areFiltersCleared={areFiltersCleared}
          setAreFiltersCleared={setAreFiltersCleared}
          togglePreloader={togglePreloader}
        />

        <DashboardTable
          records={records}
          count={count}
          rowClick={openDrawer}
          selectedPageIndex={selectedPageIndex}
          changePage={setSelectedPage}
          pageSize={defaultPageSize}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
        />
      </div>

      {
        rest.location.state?.isDrawerOpened && (
          <DashboardDrawer
            opened={rest.location.state.isDrawerOpened}
            toggle={toggle as React.Dispatch<React.SetStateAction<boolean>>}
            selectedElement={rest.location.state.selectedElement}
            filters={filters}
          />
        )
      }
    </div>

  );
};

export default DashboardPage;
