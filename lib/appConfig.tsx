import React from 'react';
import { useContext } from 'react';

type AppConfig = {
  [identifier: string]: string | number;
};

const AppConfigContext = React.createContext<AppConfig | undefined>(undefined);

export const AppConfigProvider: React.FC<{ appConfig: AppConfig }> = ({
  appConfig,
  children,
}) => {
  return (
    <AppConfigContext.Provider value={appConfig}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig: () => {
  getConfigValue: (identifier: string) => string | number;
} = () => {
  const appConfig = useContext(AppConfigContext);

  if (appConfig === undefined)
    throw new Error(
      'A <AppConfigProvider /> must be provided as a parent of this component'
    );

  return {
    getConfigValue: (identifier) => {
      const configValue = appConfig[identifier];

      if (configValue === undefined)
        throw new Error(`A value for ${identifier} is not defined`);

      return configValue;
    },
  };
};
