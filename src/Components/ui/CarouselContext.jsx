import { createContext, useContext } from "react";

export const CarouselContext = createContext(null);

export const useCarouselSelection = () => useContext(CarouselContext);
