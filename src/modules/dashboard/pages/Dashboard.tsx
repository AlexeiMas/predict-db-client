import React, { useEffect, useState } from "react";

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

const DashboardPage = (props: BasePageProps): JSX.Element => {
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

  useEffect(() => {
    if (!preloader) getRecords(selectedPageIndex, defaultPageSize, filters, sort, order);
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
    setSelectedElement(sample);
    toggleDrawer(true);
  };

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

      <DashboardDrawer
        opened={isDrawerOpened}
        toggle={toggleDrawer}
        selectedElement={selectedElement}
        filters={filters}
      />
    </div>
  );
};

export default DashboardPage;
