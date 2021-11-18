import React from 'react';

export const usePersistedState = (key: string, defaultValue: any) => {

  const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(key) || "") || defaultValue
  );

  React.useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
}