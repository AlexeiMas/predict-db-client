import Preloader from "../../../../shared/components/Preloader";
import React from "react";
import * as MCore from "@material-ui/core";
import * as models from "../../../../shared/models";
import * as filterApi from "../../../../api/filter.api";
import DropdownTumoursMenu from "../DropdownTumoursMenu";
import Icons from "../../../../shared/components/Icons"


interface Selected { mark?: 'P' | 'S'; type: 'primary' | 'sub'; value: string; }
interface TumourTypeFilterProps {
  setFilters: React.Dispatch<React.SetStateAction<models.FilterModel>>;
  index: number;
  filters: models.FilterModel;
  isClearFilter: boolean;
  setIsClearFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

/* TODO: Need to refactor this component to use universal functions instead of one-to-one binding each filter mechanic.
 *        Design makes this difficult to implement at the beginning according to not consistent logic of filters behavior.
 * */

const TumourTypeFilter = ({
  filters,
  setFilters,
  index,
  isClearFilter,
  setIsClearFilter,
}: TumourTypeFilterProps): JSX.Element => {
  const SEARCH_DEBOUNCE = 300;
  const CLEAR_AND_FOCUS_DEBOUNCE = 100;
  const INITIAL_TUMOURS = { primary: [], sub: [], }

  const searchRef = React.useRef<HTMLInputElement>(null);

  const [preloader, setPreloader] = React.useState(false);
  const [dpdIsOpened, setDpdIsOpened] = React.useState(false)
  const [selectedOptions, setSelectedOptions] = React.useState([] as Selected[])
  const [tumourFilterOptions, setTumourFilterOptions] = React.useState(INITIAL_TUMOURS as models.TumourFilterModel)

  const clearFilters = (e?: React.MouseEvent<HTMLSpanElement>): void => {
    if (e) e.preventDefault()
    const newFilters = { ...filters };
    newFilters.tumourType = [INITIAL_TUMOURS];
    setFilters({ ...newFilters });
    setSelectedOptions([])
  };

  const calculateMenuPosition = (filterType: string): void => {
    const buttons = document.querySelectorAll<HTMLElement>(`.filter-button-${filterType}`);

    buttons.forEach(button => {
      if (button) {
        const rect = button.getBoundingClientRect();
        const left = rect!.left - 2;
        const top = rect!.bottom;
        const menu = button.parentElement?.querySelector<HTMLElement>(`.filter-menu-${filterType}`);
        menu!.style.top = top + "px";
        menu!.style.left = left + "px";
      }
    });
  };

  const requestFilteredTumours = (search = "") => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })

    setPreloader(true)
    filterApi.getFilteredTumoursPSMixed({ search })
      .then(success => canceled || (prepareTumourOptions(success)))
      .catch(cancel)
      .finally(() => canceled || setPreloader(false))

    return cancel;
  };

  const loadDefaultOptions = () => requestFilteredTumours();

  const search = MCore.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = searchRef.current ? searchRef.current.value : e.target.value;
    requestFilteredTumours(searchValue.trim());
  }, SEARCH_DEBOUNCE);

  const prepareTumourOptions = (success: any) => {
    return setTumourFilterOptions(success.data);
  };

  const clearAndFocusSearchInput = MCore.debounce(() => {
    if (!searchRef.current) return;
    searchRef.current.focus()
    searchRef.current.value = ''
  }, CLEAR_AND_FOCUS_DEBOUNCE)

  const onFilterButtonClick = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) e.preventDefault();
    calculateMenuPosition('primary');

    setDpdIsOpened(true);
    loadDefaultOptions();
    clearAndFocusSearchInput()
  }

  const dropdownBgClick = (e?: React.MouseEvent<HTMLDivElement>): void => {
    if (e) e.preventDefault();
    setDpdIsOpened(false)
  };

  const onSelectTumourOption = (data: Selected) => {
    const checkToEquals = (c: Selected) => (c.value === data.value && c.type === data.type);
    if (selectedOptions.some(checkToEquals)) return;

    const joined = [...selectedOptions, data];
    setSelectedOptions(joined);

    const newFilters = { ...filters };
    const primary = joined.filter(typeIsEqualsTo('primary')).map(i => i.value);
    const sub = joined.filter(typeIsEqualsTo('sub')).map(i => i.value);

    newFilters.tumourType = [{ primary, sub },];
    setFilters({ ...newFilters });
  }

  const typeIsEqualsTo = (type: 'primary' | 'sub') => (i: Selected) => i.type === type;

  const removeOption = (index: number): void => {
    const newOptions = [...selectedOptions];
    newOptions.splice(index, 1);
    setSelectedOptions(newOptions);

    const newFilters = { ...filters };
    const primary = newOptions.filter(typeIsEqualsTo('primary')).map(i => i.value);
    const sub = newOptions.filter(typeIsEqualsTo('sub')).map(i => i.value);

    newFilters.tumourType = [{ primary, sub }];
    setFilters({ ...newFilters });
  };

  const renderSelectedFilterOptions = (): JSX.Element => {
    return (<div className="filter-tags">
      {
        selectedOptions.map((item: Selected, index: number) => (
          <div className="filter__tag" key={index}>
            <span><Icons.TumourMark mark={item.type === 'primary' ? 'P' : 'S'} />&nbsp;&nbsp;{item.value}</span>
            <div className="close-icon">
              <Icons.CloseIcon close={() => removeOption(index)} />
            </div>
          </div>
        ))
      }
      <div className="filter-tags__new-btn" onClick={() => setDpdIsOpened(true)}>
        <Icons.GreenPlusIcon />
      </div>
    </div>);
  };

  React.useEffect(() => { window.addEventListener('scroll', () => calculateMenuPosition('primary')); }, []);
  React.useEffect(() => {
    if (isClearFilter === false) return;
    clearFilters();
    setIsClearFilter(false);
  }, [isClearFilter]);

  return (
    <>
      <div className={"filter__backdrop " + (dpdIsOpened ? "active" : "")} onClick={dropdownBgClick} />
      <div className="filter">
        <div className="filter__label">
          <span className="filter__label-text">
            Tumour Type <Icons.InfoIcon title="Selects a tumour type for models. You must select a valid tumour type to get treatment response data (only treatments with existing indications for the type of cancer chosen shown, please contact us for full panel of response data)." />
          </span>
          {index === 0 && (<span className="filter__label-clear" onClick={clearFilters} > Clear </span>)}
        </div>

        <div className="filter-button">
          <div className="filter-button-row">
            <div className="filter-button-toggle filter-button-primary" onClick={onFilterButtonClick} >
              {selectedOptions.length === 0 && <Icons.PlusIcon />}
              <span className={`filter-button__label ${selectedOptions.length === 0 ? "" : "selected"}`} style={selectedOptions.length === 0 ? {} : { marginLeft: 'unset' }}             >
                {selectedOptions.length === 0 ? "Add Tumour Type" : renderSelectedFilterOptions()}
              </span>
              <div className="filter-button__chevron">
                {dpdIsOpened ? <Icons.ArrowDownIcon /> : <Icons.ArrowUpIcon />}
              </div>
            </div>

            <div className={"filter-menu filter-menu-primary " + (dpdIsOpened ? "opened" : "")} >
              {preloader && <Preloader />}
              <div className="filter-menu-header">
                <div className="filter-menu__label">Tumour Type</div>
                <input
                  ref={searchRef}
                  type="text"
                  name="search"
                  className="filter-menu__search"
                  placeholder="Search Tumour Type"
                  onChange={search}
                />
              </div>
              <DropdownTumoursMenu data={tumourFilterOptions} selectOption={onSelectTumourOption} />
              {!preloader && !tumourFilterOptions.primary.length && !tumourFilterOptions.sub.length && (
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
        </div>
      </div>
    </>
  );
};

export default TumourTypeFilter;
