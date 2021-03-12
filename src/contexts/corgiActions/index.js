import React, { useEffect, useState } from 'react';

import { CorgiTypeShape } from '~types/CorgiTypes';
import { ReactChildrenTypeRequired } from '~types/ReactChildrenTypes';

export const CorgiActionsContext = React.createContext();

const CorgiActionsContextProviderPropTypes = {
  corgi: CorgiTypeShape,
  children: ReactChildrenTypeRequired,
};

export const CorgiActionsContextProvider = ({ corgi = {}, children }) => {
  const [corgiContext, setCorgiContext] = useState(corgi);

  useEffect(() => {
    setCorgiContext(corgi);
  }, [corgi]);

  const value = { ...corgiContext };

  return <CorgiActionsContext.Provider value={value}>{children}</CorgiActionsContext.Provider>;
};

CorgiActionsContextProvider.propTypes = CorgiActionsContextProviderPropTypes;
