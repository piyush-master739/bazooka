import React, { useState, useContext, useEffect } from "react";

const PointsContext = React.createContext();

const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("localPoints")) {
      setPoints(parseInt(localStorage.getItem("localPoints")));
    }
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !isFirstRender) {
      localStorage.setItem("localPoints", points);
    }
  }, [points]);

  const updatePoints = (newPoint) => {
    setPoints(newPoint);
  };

  return (
    <PointsContext.Provider value={{ points, updatePoints }}>
      {children}
    </PointsContext.Provider>
  );
};

const usePointsContext = () => {
  return useContext(PointsContext);
};

export { PointsProvider, usePointsContext };
