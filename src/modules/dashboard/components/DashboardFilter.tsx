import PlusIcon from "../../../shared/components/Icons/PlusIcon";
import { ArrowUpIcon } from "../../../shared/components/Icons";
import { ChangeEvent, useEffect, useState } from "react";
import { TumourFilterSubTypes } from "../../../shared/types/filter-types";
import Preloader from "../../../shared/components/Preloader";
import { getFilteredData } from "../../../api/filter.api";

interface DashboardFilterProps {
  placeholder: string;
  filterType: TumourFilterSubTypes;
  nestedFilters: string[];
}

const DashboardFilter = ({ placeholder, filterType, nestedFilters }: DashboardFilterProps): JSX.Element => {

  const [showMenu, toggleShowMenu] = useState(false);
  const [preloader, togglePreloader] = useState(false);
  const [filterItems, setFilterItems] = useState([]);

  useEffect(() => {
    if (showMenu) {
      loadDefaultItems();
    }
  }, [showMenu])

  const dropdownBgClick = (): void => {
    toggleShowMenu(false);
  }

  const loadDefaultItems = async (): Promise<void> => {
    try {
      togglePreloader(true);
      const { data } = await getFilteredData(filterType, nestedFilters[0]);
      setFilterItems(data);
    } catch (e) {
    } finally {
      togglePreloader(false);
    }
  }

  const search = async (value: string): Promise<void> => undefined;

  return (
    <>
      <div className={ "filter__backdrop " + (showMenu ? 'active' : '') } onClick={ () => dropdownBgClick() }/>
      <div className="filter">
        <div className="filter__label">{ placeholder }</div>
        <div className="filter-button" onClick={ () => toggleShowMenu(!showMenu) }>
          <PlusIcon/>
          <span className='filter-button__label'>Add { placeholder }</span>
          <div className='filter-button__chevron'>
            <ArrowUpIcon/>
          </div>
        </div>
        <div className={ "filter-menu " + (showMenu ? 'opened' : '') }>
          { preloader && <Preloader/> }

          <div className="filter-menu-header">
            <div className="filter-menu__label">Diagnosis</div>
            <input type="text"
                   className="filter-menu__search"
                   placeholder="Search By Diagnosis"
                   onChange={ (event: ChangeEvent<HTMLInputElement>) => search(event.target.value) }
            />
          </div>

          <div className="filter-menu-items">
            { filterItems.map((item: string, index: number) => (
              <div className="filter-menu-item">
                { item }
              </div>
            )) }
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardFilter;