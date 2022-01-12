type GTM_KEY_TYPE = 'CLICK' | 'CLEAR' | 'SIGNIN' | 'SEARCH' | 'CHANGE' | 'SELECT' | 'SIGNOUT' | 'REQUEST' | 'RESPONSE' | 'EXPORT' | 'USER_ID' | 'RECORDS' | "QUERY";
type GTM_USER_ID_TYPE = { USER_ID: string | undefined; }
type GTM_EVENT_TYPE = { event: GTM_KEY_TYPE;[key: string]: any }

const QUERY: GTM_KEY_TYPE = 'QUERY';
const CLICK: GTM_KEY_TYPE = 'CLICK';
const CLEAR: GTM_KEY_TYPE = 'CLEAR';
const SIGNIN: GTM_KEY_TYPE = 'SIGNIN'
const SEARCH: GTM_KEY_TYPE = 'SEARCH';
const CHANGE: GTM_KEY_TYPE = 'CHANGE';
const SELECT: GTM_KEY_TYPE = 'SELECT';
const EXPORT: GTM_KEY_TYPE = 'EXPORT';
const USER_ID: GTM_KEY_TYPE = 'USER_ID';
const SIGNOUT: GTM_KEY_TYPE = 'SIGNOUT'
const REQUEST: GTM_KEY_TYPE = 'REQUEST'
const RECORDS: GTM_KEY_TYPE = 'RECORDS';
const RESPONSE: GTM_KEY_TYPE = 'RESPONSE';

const noEmpty = (o: any) => o.constructor === Object && Object.keys(o).length !== 0;

const events = { CLICK, CLEAR, SIGNIN, SEARCH, CHANGE, SELECT, SIGNOUT, REQUEST, RESPONSE, EXPORT, USER_ID, RECORDS, QUERY }

type CUSTOMIZED_EVENT_PROPS_TYPE = {
  category?: string;
  action?: string;
  label?: string;
  value?: unknown;
};

type CUSTOMIZED_EVENT_TYPE = {
  eventName: GTM_KEY_TYPE | string;
  eventProps: CUSTOMIZED_EVENT_PROPS_TYPE;
}

const customizedEvent = ({ eventName, eventProps }: CUSTOMIZED_EVENT_TYPE) => {
  (window as any).dataLayer.push({
    event: eventName,
    eventModel: {
      ...(("label" in eventProps) === false ? {} : { label: eventProps.label }),
      ...(("value" in eventProps) === false ? {} : { value: eventProps.value }),
      ...(("action" in eventProps) === false ? {} : { action: eventProps.action }),
      ...(("category" in eventProps) === false ? {} : { category: eventProps.category }),
    },
    eventProps: {
      ...(("label" in eventProps) === false ? {} : { label: eventProps.label }),
      ...(("value" in eventProps) === false ? {} : { value: eventProps.value }),
      ...(("action" in eventProps) === false ? {} : { action: eventProps.action }),
      ...(("category" in eventProps) === false ? {} : { category: eventProps.category }),
    }
  })
}

const setPageView = () => {
  (window as any).dataLayer.push({
    event: 'pageview',
    page: { url: document.location.origin + document.location.pathname + document.location.search, title: 'PAGE-' + Math.random().toString(36).slice(2) }
  })
}

const setUserID = ({ USER_ID }: GTM_USER_ID_TYPE) => {
  (window as any).dataLayer.push({ event: events.USER_ID, USER_ID })
}

const sendEvent = ({ event, ...rest }: GTM_EVENT_TYPE) => {
  const lsUserID = localStorage.getItem('imagen_therapeutics_user_email');
  const data = { event: event, [event]: rest[event] };
  const user = { event: USER_ID, [USER_ID]: lsUserID }
  switch (event) {
    case QUERY:
    case CLICK:
    case CLEAR:
    case SIGNIN:
    case SEARCH:
    case CHANGE:
    case SELECT:
    case USER_ID:
    case SIGNOUT:
    case REQUEST:
    case RESPONSE:
    case EXPORT:
    case RECORDS:
      (window as any).dataLayer.push(data)
      if (lsUserID) (window as any).dataLayer.push(user)
      break;
    default:
      throw new Error("Unexpected event(gtm): #" + event);
  }
}

export const GTM_SRV = { events, sendEvent, setUserID, noEmpty, customizedEvent, setPageView };
export const GTM_CONTAINER_ID = 'GTM-PKVQH2D';