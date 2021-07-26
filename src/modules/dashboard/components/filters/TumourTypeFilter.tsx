import PlusIcon from "../../../../shared/components/Icons/PlusIcon";
import { ArrowUpIcon } from "../../../../shared/components/Icons";
import Preloader from "../../../../shared/components/Preloader";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from "react";
import { getFilteredData } from "../../../../api/filter.api";
import DropdownMenu from "../DropdownMenu";
import ArrowDownIcon from "../../../../shared/components/Icons/ArrowDownIcon";
import {
  FilterModel,
  TumourFilterModel,
} from "../../../../shared/models/filters.model";
import { debounce } from "@material-ui/core";
import CloseIcon from "../../../../shared/components/Icons/CloseIcon";
import GreenPlusIcon from "../../../../shared/components/Icons/GreenPlusIcon";
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";

interface TumourTypeFilterProps {
  setFilters: Dispatch<SetStateAction<FilterModel>>;
  index: number;
  filters: FilterModel;
  isClearFilter: boolean;
  setIsClearFilter: Dispatch<SetStateAction<boolean>>;
}

interface TumourTypeFilterPrimary {
  primary: string;
  hasSubs: boolean;
}

type FilterTypes = "primary" | "sub";

/* TODO: Need to refactor this component to use universal functions instead of one-to-one binding each filter mechanic.
 *        Design makes this difficult to implement at the beginning according to not consistent logic of filters behaviour.
 * */

const TumourTypeFilter = ({
  filters,
  setFilters,
  index,
  isClearFilter,
  setIsClearFilter,
}: TumourTypeFilterProps): JSX.Element => {
  const [showPrimaryDropdown, setShowPrimaryTypesDropdown] = useState(false);
  const [showSubTypesDropdown, setShowSubDropdown] = useState(false);

  const [preloader, setPreloader] = useState(false);
  const [filterOptions, setFilterOptions] = useState([] as string[]);
  const [filterOptionsExtended, setFilterOptionsExtended] = useState(
    [] as TumourTypeFilterPrimary[]
  );

  const [primaryFilter, setPrimaryFilter] = useState("");
  const [subFilter, setSubFilter] = useState([] as string[]);

  const addNewEmptyFilter = (): void => {
    const requiredEmptyFilter = filters.tumourType.find(
      (el: TumourFilterModel) => el.primary === null
    );

    if (!requiredEmptyFilter) {
      filters.tumourType.push({
        primary: null,
        sub: [],
      });
    }
  };

  const dropdownBgClick = (): void => {
    setShowPrimaryTypesDropdown(false);
    setShowSubDropdown(false);
  };

  const search = async (
    value: string,
    filterType: FilterTypes,
    primaryFilter?: string
  ): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getFilteredData(
        "tumours",
        filterType,
        value,
        primaryFilter
      );

      if (filterType === "primary") {
        const options = data.map((i: TumourTypeFilterPrimary) => i.primary);
        setFilterOptions([...options]);
        setFilterOptionsExtended([...data]);
      } else {
        setFilterOptions([...data]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
    }
  };

  const loadDefaultOptions = async (
    filterType: FilterTypes,
    query?: string
  ): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getFilteredData(
        "tumours",
        filterType,
        query,
        primaryFilter
      );

      if (filterType === "primary") {
        const options = data.map((i: TumourTypeFilterPrimary) => i.primary);
        setFilterOptions(options);
        setFilterOptionsExtended(data);
      } else {
        setFilterOptions([...data]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
    }
  };

  const searchHandler = useMemo(() => debounce(search, 500), []);

  const canShowSubOptions = (): boolean => {
    return !!(subFilter && subFilter.length);
  };

  const canShowSubFilter = (): boolean => {
    const currentValue = filterOptionsExtended.find(
      (i) => i.primary === primaryFilter
    );

    return !!(primaryFilter && primaryFilter.length && currentValue?.hasSubs);
  };

  const calculateMenuPosition = (filterType: string): void => {
    const buttons = document.querySelectorAll<HTMLElement>(`.filter-button-${filterType}`);

    buttons.forEach(button => {
      if (button) {
        const rect = button.getBoundingClientRect();
        const left = rect!.left - 2;
        const top = rect!.bottom + 2;
        const menu = button.parentElement?.querySelector<HTMLElement>(`.filter-menu-${filterType}`);
        menu!.style.top = top + "px";
        menu!.style.left = left + "px";
      }
    });
  };

  const onFilterButtonClick = (
    filterType: FilterTypes,
    query?: string
  ): void => {
    switch (filterType) {
      case "primary":
        setShowPrimaryTypesDropdown(!showPrimaryDropdown);
        calculateMenuPosition('primary');
        break;
      case "sub":
        setShowSubDropdown(!showSubTypesDropdown);
        calculateMenuPosition('sub');
        break;
    }

    loadDefaultOptions(filterType, query);
  };

  const selectedSubOptions = (): JSX.Element => {
    if (canShowSubOptions()) {
      return (
        <div className="filter-tags">
          {subFilter.map((item: string, index: number) => (
            <div className="filter__tag" key={index}>
              <span>{item}</span>
              <div className="close-icon">
                <CloseIcon close={() => removeSelectedSubOption(index)} />
              </div>
            </div>
          ))}

          <div
            className="filter-tags__new-btn"
            onClick={() => setShowSubDropdown(true)}
          >
            <GreenPlusIcon />
          </div>
        </div>
      );
    }

    return <></>;
  };

  // Methods of working with filters
  const onSelectPrimaryOption = (value: string): void => {
    setShowPrimaryTypesDropdown(false);
    updatePrimaryFilter(value);
    addNewEmptyFilter();
  };

  const onSelectSubOption = (value: string): void => {
    const newSubOptions = [...subFilter];
    newSubOptions.push(value);
    setSubFilter(newSubOptions);
    updateSubFilters(newSubOptions);
  };

  const removeSelectedSubOption = (index: number): void => {
    const newFilters = [...subFilter];
    newFilters.splice(index, 1);
    setSubFilter(newFilters);
  };

  const updatePrimaryFilter = (value: string): void => {
    const newFilters = { ...filters };

    setPrimaryFilter(value);
    setSubFilter([]);

    newFilters.tumourType[index] = {
      primary: value,
      sub: [],
    };

    setFilters({ ...newFilters });
  };

  const updateSubFilters = (options: string[]): void => {
    const newFilters = { ...filters };

    newFilters.tumourType[index] = {
      primary: primaryFilter,
      sub: [...options],
    };

    setFilters({ ...newFilters });
  };

  const clearFilters = (): void => {
    const newFilters = { ...filters };
    newFilters.tumourType = [
      {
        primary: null,
        sub: [],
      },
    ];

    setPrimaryFilter("");
    setSubFilter([]);

    setFilters({ ...newFilters });
  };

  useEffect(() => {
    if (isClearFilter) {
      clearFilters();
      setIsClearFilter(false);
    }
  }, [isClearFilter]); // eslint-disable-line

  useEffect(() => {
    window.addEventListener('scroll', () => {
      calculateMenuPosition('primary');
      calculateMenuPosition('sub');
    });
  }, []);

  return (
    <>
      <div
        className={
          "filter__backdrop " +
          (showPrimaryDropdown || showSubTypesDropdown
            ? "active"
            : "")
        }
        onClick={() => dropdownBgClick()}
      />

      <div className="filter">
        <div className="filter__label">
          <span className="filter__label-text">
            Tumour Type <InfoIcon title="Selects a tumour type for models. You must select a valid tumour type to get treatment response data (only treatments with existing indications for the type of cancer chosen shown, please contact us for full panel of response data)." />
          </span>
          {index === 0 && (
            <span
              className="filter__label-clear"
              onClick={() => clearFilters()}
            >
              Clear
            </span>
          )}
        </div>

        <div className="filter-button">
          {/* Primary Control */}
          <div className="filter-button-row">
            <div
              className="filter-button-toggle filter-button-primary"
              onClick={() => onFilterButtonClick("primary")}
            >
              {!primaryFilter && <PlusIcon />}

              <span
                className={`filter-button__label ${
                  primaryFilter ? "selected" : ""
                }`}
              >
                {primaryFilter ? primaryFilter : "Add Tumour Type"}
              </span>
              <div className="filter-button__chevron">
                {showPrimaryDropdown ? <ArrowDownIcon /> : <ArrowUpIcon />}
              </div>
            </div>

            <div
              className={
                "filter-menu filter-menu-primary " + (showPrimaryDropdown ? "opened" : "")
              }
            >
              {preloader && <Preloader />}

              <div className="filter-menu-header">
                <div className="filter-menu__label">Primary Type</div>
                <input
                  type="text"
                  className="filter-menu__search"
                  placeholder="Search By Primary Type"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    searchHandler(event.target.value, "primary")
                  }
                />
              </div>

              {!preloader && filterOptions && (
                <DropdownMenu
                  items={filterOptions}
                  selectOption={onSelectPrimaryOption}
                  multiSelect={false}
                />
              )}

              {!preloader && !filterOptions.length && (
                <div className="filter-no-data">
                  <span className="filter-no-data__title">
                    No results found
                  </span>
                  <span className="filter-no-data__label">
                    No results were found for your search, so try changing the
                    search or filtering parameters and try again.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sub Control */}
          {canShowSubFilter() && (
            <div className={`filter-button-row ${subFilter ? "no-hover" : ""}`}>
              <div
                className="filter-button-toggle filter-button-sub"
                onClick={() => onFilterButtonClick("sub")}
              >
                <div className="filter-button__label selected-gray">
                  {!canShowSubOptions() && "Sub Type"}
                  {selectedSubOptions()}
                </div>
              </div>

              <div
                className={
                  "filter-menu filter-menu-sub " + (showSubTypesDropdown ? "opened" : "")
                }
              >
                {preloader && <Preloader />}

                <div className="filter-menu-header">
                  <div className="filter-menu__label">Sub Type</div>
                  <input
                    type="text"
                    className="filter-menu__search"
                    placeholder="Search By Sub Type"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      searchHandler(event.target.value, "sub", primaryFilter)
                    }
                  />
                </div>

                {!preloader && filterOptions && (
                  <DropdownMenu
                    items={filterOptions}
                    selectOption={onSelectSubOption}
                    multiSelect={true}
                  />
                )}

                {!preloader && !filterOptions.length && (
                  <div className="filter-no-data">
                    <span className="filter-no-data__title">
                      No results found
                    </span>
                    <span className="filter-no-data__label">
                      No results were found for your search, so try changing the
                      search or filtering parameters and try again.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TumourTypeFilter;
