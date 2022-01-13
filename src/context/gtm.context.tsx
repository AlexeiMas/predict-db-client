import React from 'react';
import * as analytics from '../analytics';

type GTM_KEY_TYPE = 'CLICK' | 'CLEAR' | 'SIGNIN' | 'SEARCH' | 'CHANGE' | 'SELECT' | 'SIGNOUT' | 'REQUEST' | 'RESPONSE' | 'EXPORT' | 'USER_ID' | 'RECORDS';
type GTM_USER_ID_TYPE = { USER_ID: string | undefined; }
type GTM_EVENT_TYPE = { event: GTM_KEY_TYPE;[key: string]: any; }

type GTM_TYPE = {
  setUserID: (incoming: GTM_USER_ID_TYPE) => void;
  sendEvent: (incoming: GTM_EVENT_TYPE) => void;
  events: {
    CLICK: GTM_KEY_TYPE,
    CLEAR: GTM_KEY_TYPE,
    SIGNIN: GTM_KEY_TYPE,
    SEARCH: GTM_KEY_TYPE,
    CHANGE: GTM_KEY_TYPE,
    SELECT: GTM_KEY_TYPE,
    SIGNOUT: GTM_KEY_TYPE,
    REQUEST: GTM_KEY_TYPE,
    RESPONSE: GTM_KEY_TYPE,
    EXPORT: GTM_KEY_TYPE,
    USER_ID: GTM_KEY_TYPE,
    RECORDS: GTM_KEY_TYPE
  }
}

const useGTMValueHook = (window: any): GTM_TYPE => {
  window.dataLayer = (window.dataLayer || []);
  return {
    setUserID: analytics.GTM_SRV.setUserID,
    sendEvent: analytics.GTM_SRV.sendEvent,
    events: analytics.GTM_SRV.events,
  }
}

const GtmCTX = React.createContext({} as GTM_TYPE)
export const useGTM = () => {
  const ctx = React.useContext(GtmCTX);
  if (!ctx) throw new Error("context used outside of provider");
  return ctx;
}

export const Provider = (({ ...rest }) => {
  return (
    <GtmCTX.Provider value={useGTMValueHook(window)}>
      {rest.children}
    </GtmCTX.Provider>
  )
})
