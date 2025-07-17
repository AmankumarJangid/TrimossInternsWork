// utils/getStateCode.js
import { State } from "country-state-city";

export const getStateCode = (countryCode, stateName) => {
  const state = State.getStatesOfCountry(countryCode).find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return state?.isoCode || null;
};
