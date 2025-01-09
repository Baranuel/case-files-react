import React from 'react';

export const createGenericContext = <T,>() => {
  const genericContext = React.createContext<T | undefined>(undefined);

  // Check if the value provided to the context is defined or throw an error
  // We do this so we don't return a undefined context
  const useGenericContext = () => {
    const context = React.useContext(genericContext);

    if (!context) {
      throw new Error('useGenericContext must be used within a Provider');
    }

    return context;
  };

  return [
    useGenericContext,
    genericContext.Provider,
    genericContext.Consumer,
  ] as const;
};