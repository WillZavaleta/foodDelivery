import React, { useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const AddressAutocomplete = ({ onPlaceSelected, isOn, onChangeHandler, data }) => {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      onPlaceSelected(place.formatted_address);
    }
  };

  const xalapaBounds = {
    north: 19.5848,
    south: 19.4750,
    east: -96.8600,
    west: -96.9600,
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAAs6BwKlvWDlEzSN6k0jfPnmlNWtiLjlU"
      libraries={libraries}
    >
      <Autocomplete
       options={{
        bounds: xalapaBounds,
        strictBounds: true,
        types: ["address"]
      }}
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Ingresa tu dirección"
          required={isOn} 
          name="street" 
          onChange={onChangeHandler} 
          value={data.street}
          style={{ width: "100%", padding: "8px" }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default AddressAutocomplete;
