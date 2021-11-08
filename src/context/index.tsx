import React, { useState, useEffect } from "react";
import storage from "../services/storage.service";

interface UserState {
  userName: string;
  userEmail: string;
  accessToken: string;
  refreshToken: string;
  accessExpMS: number;
  refreshExpMS: number;
  isAuthorized: boolean;
}

interface AppContextMethods {
  setUserName: React.Dispatch<React.SetStateAction<string>>,
  setUserEmail: React.Dispatch<React.SetStateAction<string>>,
  setAccessToken: React.Dispatch<React.SetStateAction<string>>,
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>,
  setAccessExpMS: React.Dispatch<React.SetStateAction<number>>,
  setRefreshExpMS: React.Dispatch<React.SetStateAction<number>>,
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>,
}

interface AppContextState {
  user: UserState;
  contextMethods: AppContextMethods;
}

interface AppContextWrapperProps {
  children: React.ReactElement;
}

const AppContext = React.createContext({} as AppContextState);

export const AppContextWrapper = (props: AppContextWrapperProps) => {
  const { children } = props;
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [accessExpMS, setAccessExpMS] = useState(0);
  const [refreshExpMS, setRefreshExpMS] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const state = {
    user: {
      userName,
      userEmail,
      accessToken,
      refreshToken,
      accessExpMS,
      refreshExpMS,
      isAuthorized,
    },
    contextMethods: {
      setUserName,
      setUserEmail,
      setAccessToken,
      setRefreshToken,
      setAccessExpMS,
      setRefreshExpMS,
      setIsAuthorized,
    },
  };

  const checkIfUserAuthorized = async () => {
    try {
      const isAuth = storage.checkBool("is_authorized");
      const accessExp = storage.get("access_token_expires");

      if (!isAuth || !accessExp || accessExp <= Date.now()) {
        setIsAuthorized(false);
        return;
      }

      const name = storage.get("user_name");
      const email = storage.get("user_email");
      const access = storage.get("access_token");
      const refresh = storage.get("refresh_token");
      const refreshExp = storage.get("refresh_token_expires");

      if (name) setUserName(name);
      if (email) setUserEmail(email);
      if (access) setAccessToken(access);
      if (refresh) setRefreshToken(refresh);
      if (accessExp) setAccessExpMS(accessExp);
      if (refreshExp) setRefreshExpMS(refreshExp);

      setIsAuthorized(true);
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    checkIfUserAuthorized();
  }, []);

  useEffect(() => {
    storage.set("is_authorized", isAuthorized);
  }, [isAuthorized]);

  useEffect(() => {
    storage.set("user_name", userName);
  }, [userName]);

  useEffect(() => {
    storage.set("user_email", userEmail);
  }, [userEmail]);

  useEffect(() => {
    storage.set("access_token", accessToken);
  }, [accessToken]);

  useEffect(() => {
    storage.set("refresh_token", refreshToken);
  }, [refreshToken]);

  useEffect(() => {
    storage.set("access_token_expires", accessExpMS);
  }, [accessExpMS]);

  useEffect(() => {
    storage.set("refresh_token_expires", refreshExpMS);
  }, [refreshExpMS]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export const useAppContext = () => React.useContext(AppContext);
