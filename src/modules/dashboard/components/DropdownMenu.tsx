import { useEffect, useState } from "react";

interface DropdownMenuProps {
  items: string[];
  selectOption: (value: string) => void;
  multiSelect: boolean;
}

interface DropdownMenuOption {
  label: string;
  selected: boolean;
}

const DropdownMenu = ({ items, selectOption, multiSelect }: DropdownMenuProps): JSX.Element => {

  const [menuOptions, setMenuOptions] = useState([] as any[]);

  useEffect(() => {
    // All filters are come as string[] from back-end. This function changes the structure of dropdown.
    const newItems = items.map((item: string) => {
      return {
        label: item,
        selected: false
      }
    });

    setMenuOptions(newItems);
  }, [items]);

  const onSelectOption = (item: DropdownMenuOption): void => {
    if (!multiSelect) {
      menuOptions.forEach((item) => {
        item.selected = false;
      });
    }

    item.selected = !item.selected;
    selectOption(item.label);
  }


  return (
    <div className="filter-menu-items">
      { menuOptions.map((item: DropdownMenuOption, index: number) => (
        <div className={ "filter-menu-item " + (item.selected ? 'selected' : '') }
             key={ index }
             onClick={ (t) => onSelectOption(item) }>
          { item.label }
        </div>
      )) }
    </div>
  )
}

export default DropdownMenu;