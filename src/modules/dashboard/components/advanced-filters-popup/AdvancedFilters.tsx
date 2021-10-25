import React from 'react'
import * as ReactDom from 'react-dom';
import * as MCore from "@material-ui/core";
import style from './AdvancedFilters.module.scss'
import * as Icons from '../../../../assets/images';
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import { AdvancedFiltersForm } from './AdvancedFiltersForm';
import { CloseBtn } from './CloseBtn';
import './test-data';
import { useAdvancedFiltersContext } from '../../../../context/advanced-filters.context';

export const VALUES = ['NGS', 'Patient Treatment History', 'Growth Characteristics', 'Plasma', 'PBMC', 'PDC Model Treatment Response']
export const CLOSE_MODAL = { name: 'CLOSE_MODAL', event: new Event('CLOSE_MODAL') }
const DISPLAY_NAME = 'ADVANCED_FILTERS';

export const AdvancedFilters = (({ ...rest }): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null)
  const targetElement = (rest.target || document.body) as HTMLElement;
  const context = useAdvancedFiltersContext()

  const show = () => { setVisible(true) }
  const hide = () => { setVisible(false) }
  const toggle = () => { setVisible(!visible) }

  const debouncedShow = MCore.debounce(() => setVisible(true), 300) /* eslint-disable-line */
  const debouncedHide = MCore.debounce(() => setVisible(false), 300) /* eslint-disable-line */
  const debouncedToggle = MCore.debounce(() => setVisible(!visible), 300) /* eslint-disable-line */


  React.useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!contentRef.current) return;
      if (!e.target.contains(contentRef.current)) return
      document.body.dispatchEvent(CLOSE_MODAL.event);
      debouncedHide()
    }

    targetElement.addEventListener('click', handleClickOutside)
    return () => {
      targetElement.removeEventListener('click', handleClickOutside)
    }
  })


  const BUTTON_STATES_MAP = {
    true: { backgroundColor: '#0941AC', color: "white", borderColor: 'transparent', marginLeft: 10 },
    false: { backgroundColor: '#EEEEF2', color: "#656790", borderColor: 'transparent', marginLeft: 10 }
  }

  const controls = { show, hide, toggle, debouncedShow, debouncedToggle, debouncedHide }
  return (
    <div id={DISPLAY_NAME}>
      <div >
        <button
          style={BUTTON_STATES_MAP[`${Boolean(context.hasAdvanced)}`]}
          className="btn btn-outlined search__filter-btn"
          onClick={toggle}
        >
          <Icons.FilterIcon height={24} width={24} />
          <span>Advanced&nbsp;Filters</span>
        </button>
      </div>
      {
        visible && ReactDom.createPortal(
          (
            <div id="ME" ref={contentRef} className={style.container} >
              <div className={style.content}>
                <div className={style.top}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Advanced&nbsp;Filters&nbsp;
                    <InfoIcon height={28} width={28} title='You can enter a list of entries, separated by a newline into each filter input' />
                  </div>
                  <CloseBtn onClose={hide} />
                </div>
                <div className={style.center}>
                  <AdvancedFiltersForm {...Object.assign(rest, {})} controls={controls} />
                </div>
              </div>
            </div>
          ),
          targetElement
        )
      }
    </div>
  )
})