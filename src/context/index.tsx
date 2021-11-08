import React from "react";
import storage from "../services/storage.service";

type KEY2 = "access_token_expires" |
  "access_token" |
  "user_name" |
  "user_email" |
  "refresh_token_expires" |
  "is_authorized" |
  "refresh_token"
interface UserState2 {
  access_token: string;
  user_name: string;
  user_email: string;
  refresh_token: string;
  access_token_expires: number;
  refresh_token_expires: number;
  is_authorized: boolean;
}

interface AppContextMethods {
  updateStateItem: (key: KEY2, value: string | boolean | number) => void;
  updateState: (state: UserState2) => void;
  clearState: () => void;
  isAuthenticated: () => boolean;
}
interface AppContextState {
  user: UserState2;
  controls: AppContextMethods;
}
interface AppContextWrapperProps {
  children: React.ReactElement;
}

const AppContext = React.createContext({} as AppContextState);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error("context used outside of provider");
  return context
}

const EMPTY_STATE: UserState2 = {
  access_token: "",
  user_name: "",
  user_email: "",
  refresh_token: "",
  access_token_expires: 0,
  refresh_token_expires: 0,
  is_authorized: false,
}

const useAppHook = (): AppContextState => {
  const parsed = storage.getParsed() as UserState2;

  const INITIAL_STATE: UserState2 = {
    access_token: ("access_token" in parsed && parsed.access_token !== "") ? parsed.access_token : "",
    user_name: ("user_name" in parsed && parsed.user_name !== "") ? parsed.user_name : "",
    user_email: ("user_email" in parsed && parsed.user_email !== "") ? parsed.user_email : "",
    refresh_token: ("refresh_token" in parsed && parsed.refresh_token !== "") ? parsed.refresh_token : "",
    access_token_expires: ("access_token_expires" in parsed && parsed.access_token_expires !== 0) ? parsed.access_token_expires : 0,
    refresh_token_expires: ("refresh_token_expires" in parsed && parsed.refresh_token_expires !== 0) ? parsed.refresh_token_expires : 0,
    is_authorized: ("is_authorized" in parsed && parsed.is_authorized !== false) ? parsed.is_authorized : false,
  }

  const [state, setState] = React.useState(INITIAL_STATE)

  const updateStateItem = (key: KEY2, value: number | string | boolean) => {
    storage.set(key, value)
    const updated = { ...state, [key]: value }
    setState(updated)
  }

  const updateState = (incomingState: UserState2) => {
    Object.entries(incomingState).forEach(([key, value]) => storage.set(key, value))
    setState(incomingState);
  }

  const clearState = () => { localStorage.clear(); setState(EMPTY_STATE) }

  const isAuthenticated = () => {
    const access_token = storage.get("access_token")
    const access_token_expires = storage.get("access_token_expires");
    return !!access_token && parseInt(access_token_expires) > Date.now()
  }

  React.useEffect(() => {
    Object.entries(state).forEach(([key, value]) => storage.set(key, value))
  })

  return {
    user: { ...state },
    controls: { updateStateItem, updateState, clearState, isAuthenticated }
  };
}

export const AppContextWrapper = (props: AppContextWrapperProps) => {
  const { children } = props;
  const value = useAppHook() as AppContextState;
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
