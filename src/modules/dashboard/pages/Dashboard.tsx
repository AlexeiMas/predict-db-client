import React, { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";

import DashboardHeader from "../components/DashboardHeader";
import DashboardSearch from "../components/DashboardSearch";
import DashboardDrawer from "../components/DashboardDrawer";
import Preloader from "../../../shared/components/Preloader";
import DashboardTable from "../components/DashboardTable";
import DashboardFilters from "../components/DashboardFilters";

import titleService from "../../../services/title.service";
import dataTransformer from "../../../services/data-transformer.service";

import { BasePageProps } from "../../../shared/models";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { searchItems } from "../../../api/search.api";
import { FilterModel } from "../../../shared/models/filters.model";
import { useHistory } from "react-router-dom";
import PrivateRoute from "modules/PrivateRoute";
import { routes } from '../../../routes';

const DashboardPage = (props: BasePageProps): JSX.Element => {
  const history = useHistory()
  titleService.setTitle(props.title);
  const defaultPageSize = 20;

  const [isDrawerOpened, toggleDrawer] = useState(false);
  const [areFiltersOpened, toggleFilter] = useState(true);
  const [preloader, togglePreloader] = useState(false);

  const [records, setRecords] = useState([] as ClinicalSampleModel[]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");

  const [areFiltersCleared, setAreFiltersCleared] = useState(false);

  const [filters, setFilters] = useState({
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

  const [selectedPageIndex, setSelectedPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState(
    {} as ClinicalSampleModel
  );

  const filtersRef = useRef<FilterModel>();

  useEffect(() => {
    filtersRef.current = filters;
  });

  const prevFilters = filtersRef.current;

  useEffect(() => {
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

  const openDrawer = (sample: ClinicalSampleModel): void => {
    history.push('/dashboard?Model_ID=' + sample.pdcModel)
    const search = new URLSearchParams()
    if (sample.pdcModel) search.append("Model_ID", sample.pdcModel)
    history.push({ pathname: routes.dashboard, search: `?${search}`, state: { ...sample } })
    setSelectedElement(sample);
    toggleDrawer(true);
  };

  const toggle = (state: boolean) => {
    history.push('/dashboard')
    toggleDrawer(state);
  }

  const onToggleFilters = (value: boolean): void => {
    toggleFilter(value);
  };




  return (
    <>
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



      </div>
      <PrivateRoute path={routes.modelID} component={({...rest}) => {
        const search =  rest.location.search.slice(1);
        const [Model_ID] = search.split("=").reverse()
        console.log('[ Model_ID ]', Model_ID);
        return !isDrawerOpened ? <></> : (
          <DashboardDrawer
            opened={isDrawerOpened}
            toggle={toggle as Dispatch<SetStateAction<boolean>>}
            selectedElement={selectedElement}
            filters={filters}
          />
        )
      }} />

    </>
  );
};

export default DashboardPage;
