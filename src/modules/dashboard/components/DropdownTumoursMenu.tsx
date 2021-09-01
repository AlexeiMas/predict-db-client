/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { TumourMark } from "shared/components/Icons";

interface OptionItems {
  primary: string[];
  sub: string[];
}

interface DropdownMenuOption {
  label: string;
  selected: boolean;
}

interface Selected {
  item: DropdownMenuOption;
  type: 'primary' | 'sub';
  mark?: 'P' | 'S';
}

interface Selected2 {
  value: string;
  type: 'primary' | 'sub';
  mark?: 'P' | 'S';
}

interface DropdownGenesMenuProps {
  data: OptionItems;
  selectOption: (data: Selected2) => void;
}



const DropdownTumoursMenu = ({
  data,
  selectOption,
}: DropdownGenesMenuProps): JSX.Element => {
  const [primaryOptions, setPrimaryOptions] = useState([] as any[]);
  const [subOptions, setSubOptions] = useState([] as any[]);

  const getOptions = (values: string[]): DropdownMenuOption[] => {
    return values.map((label: string) => ({ label, selected: false }))
  };

  useEffect(() => {
    const primary = getOptions(data.primary);
    const sub = getOptions(data.sub);
    setPrimaryOptions(primary);
    setSubOptions(sub);
  }, [data]);

  const onSelectOption = (data: Selected): void => {
    data.item.selected = !data.item.selected;
    selectOption({ value: data.item.label, type: data.type, ...(data.mark && { mark: data.mark }) });
  };

  return (
    <div className="filter-menu-genes">
      {primaryOptions && !!primaryOptions.length && (
        <div className="filter-menu-items genes-filter">
          <div className="filter-menu-header genes-filter">
            <div className="filter-menu__label">Primary tumours types</div>
          </div>
          {primaryOptions.map((item: DropdownMenuOption, index: number) => (
            <div
              className="filter-menu-item genes-filter"
              key={index}
              onClick={() => onSelectOption({ item, type: 'primary', mark: 'P' })}
            >
              <TumourMark mark='P' />&nbsp;&nbsp;
              {item.label}
            </div>
          ))}
        </div>
      )}
      {subOptions && !!subOptions.length && (
        <div className="filter-menu-items genes-filter">
          <div className="filter-menu-header genes-filter">
            <div className="filter-menu__label">Sub tumours types</div>
          </div>
          {subOptions.map((item: DropdownMenuOption, index: number) => (
            <div
              className="filter-menu-item genes-filter"
              key={index}
              onClick={() => onSelectOption({ item, type: 'sub', mark: 'S' })}
            >
              <TumourMark mark='S' />&nbsp;&nbsp;
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownTumoursMenu;
