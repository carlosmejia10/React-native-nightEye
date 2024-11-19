import React, { createContext, useContext, useState } from "react";

const LocalidadContext = createContext();

export const LocalidadProvider = ({ children }) => {
  const [localidad, setLocalidad] = useState(null);

  return (
    <LocalidadContext.Provider value={{ localidad, setLocalidad }}>
      {children}
    </LocalidadContext.Provider>
  );
};

export const useLocalidad = () => {
  const context = useContext(LocalidadContext);
  if (!context) {
    throw new Error("useLocalidad debe ser usado dentro de LocalidadProvider");
  }
  return context;
};