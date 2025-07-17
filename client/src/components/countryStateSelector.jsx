import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";

export default function CountryStateSelector({ onChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const result = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(result);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const country = countries.find((c) => c.isoCode === code);
    setSelectedCountry(country);
    setSelectedState(null);

    onChange({
      country: {
        name: country.name,
        value: country.isoCode,
        dialCode: country.phonecode,
      },
      state: null,
    });
  };

  const handleStateChange = (e) => {
    const code = e.target.value;
    const state = states.find((s) => s.isoCode === code);
    setSelectedState(state);

    onChange({
      country: {
        name: selectedCountry?.name,
        value: selectedCountry?.isoCode,
        dialCode: selectedCountry?.phonecode,
      },
      state: {
        name: state?.name,
        value: state?.isoCode,
      },
    });
  };

  return (
    <div className="mb-4">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Country Selector */}
    <div className="flex-1">
      <label className="block font-semibold mb-1">Country</label>
      <select
        value={selectedCountry?.isoCode || ""}
        onChange={handleCountryChange}
        className="border p-2 w-full"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>
    </div>

    {/* State/Province Selector */}
    <div className="flex-1">
      <label className="block font-semibold mb-1">State / Province</label>
      <select
        value={selectedState?.isoCode || ""}
        onChange={handleStateChange}
        className="border p-2 w-full"
        disabled={states.length === 0}
      >
        <option value="">
          {states.length === 0
            ? "No states found for this country"
            : "Select State"}
        </option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

  );
}
