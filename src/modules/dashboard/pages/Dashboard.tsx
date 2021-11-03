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
import { useHistory, useLocation } from "react-router-dom";
import { routes } from '../../../routes';
import { useDrawlerCtx } from '../../../context/drawler.context';

export const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};

const DashboardPage = ({ ...rest }): JSX.Element => {
  const history = useHistory()
  const query = useQuery();
  titleService.setTitle(rest.title);
  const defaultPageSize = 20;
  const drawlerCTX = useDrawlerCtx();


  const [areFiltersOpened, toggleFilter] = React.useState(true);
  const [preloader, togglePreloader] = React.useState(true);

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

  const updateFilters = (data: FilterModel) => {
    setFilters(data);
    drawlerCTX.controls.updateFilters(data)
  }

  React.useEffect(() => {
    filtersRef.current = filters;
  });

  const prevFilters = filtersRef.current;

  const UNMOUNTED = 'unmounted'
  React.useEffect(() => {
    const selectedPage = filters === prevFilters ? selectedPageIndex : 0;
    setSelectedPage(selectedPage);
    const cancel = getRecords(selectedPage, defaultPageSize, filters, sort, order);
    return () => { cancel(UNMOUNTED) }
  }, [filters, selectedPageIndex, sort, order]); // eslint-disable-line


  const logReason = (reason: any) => {
    if (reason === UNMOUNTED) return;
    console.log('[ reason ]', reason);
  }

  const getRecords = (
    pageIndex: number,
    pageSize: number,
    filters: FilterModel,
    sort: string,
    order: string
  ) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; logReason(reason) })

    const setState = (data: any) => {
      const transformedData = dataTransformer.transformSamplesToFrontEndFormat(
        data.rows
      );
      drawlerCTX.controls.updateRecords([...transformedData])
      setRecords([...transformedData]);
      setCount(data.count);
    }

    if (!canceled) {
      if (preloader === false) togglePreloader(true);
      searchItems(pageSize, pageIndex, filters, sort, order)
        .then(success => canceled || success.data)
        .then(success => canceled || !success || setState(success))
        .catch(cancel)
        .finally(() => canceled || togglePreloader(false))
    }


    return cancel;
  }

  const openDrawer = (selected: ClinicalSampleModel): void => {
    const search = new URLSearchParams()
    drawlerCTX.controls.updateSelectedElement(selected)
    if (selected.pdcModel.trim()) {
      search.append("Model_ID", selected.pdcModel.trim())
      search.append('show', 'true')
      history.push({
        pathname: 'model',
        search: `?${search}`,
        state: { show: true, selectedElement: selected }
      })
    }
  };


  const toggle = (state: boolean) => {
    const search = new URLSearchParams()
    history.push({
      pathname: routes.dashboard.base,
      search: `?${search}`,
      state: { show: state }
    })
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
          setFilters={updateFilters as React.Dispatch<React.SetStateAction<FilterModel>>}
          opened={areFiltersOpened}
          areFiltersCleared={areFiltersCleared}
          setAreFiltersCleared={setAreFiltersCleared}
        />

        <DashboardSearch
          resultsLength={count}
          areFiltersOpened={areFiltersOpened}
          toggleFilter={onToggleFilters}
          filters={filters}
          setFilters={updateFilters as React.Dispatch<React.SetStateAction<FilterModel>>}
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
        /true/gi.test(query.get('show') || '') && (
          <DashboardDrawer
            opened={/true/gi.test(query.get('show') || '')}
            toggle={toggle as React.Dispatch<React.SetStateAction<boolean>>}
            getRecords={() => getRecords(filters === prevFilters ? selectedPageIndex : 0, defaultPageSize, filters, sort, order)}
          />
        )
      }
    </div>

  );
};

export default DashboardPage;
