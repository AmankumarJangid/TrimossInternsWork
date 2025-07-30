import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

export default function AddressInfoStep({ formData, updateFormData }) {
  return (
    <div className="grid grid-cols-2 gap-10">
      <InputField
        placeholder="Date of Birth"
        value={formData["Date of Birth"] || ""}
        onChange={(e) => updateFormData({ "Date of Birth": e.target.value })}
      />

      <InputField
        placeholder="State"
        value={formData["State"] || ""}
        onChange={(e) => updateFormData({ State: e.target.value })}
      />

      <InputField
        placeholder="Zip Code"
        value={formData["Zip Code"] || ""}
        onChange={(e) => updateFormData({ "Zip Code": e.target.value })}
      />

      <InputField
        placeholder="City"
        value={formData["City"] || ""}
        onChange={(e) => updateFormData({ City: e.target.value })}
      />

      <div className="col-span-2">
        <InputField
          placeholder="Address Line 1"
          value={formData["Address Line 1"] || ""}
          onChange={(e) => updateFormData({ "Address Line 1": e.target.value })}
        />
      </div>

      <div className="col-span-2">
        <InputField
          placeholder="Address Line 2"
          value={formData["Address Line 2"] || ""}
          onChange={(e) => updateFormData({ "Address Line 2": e.target.value })}
        />
      </div>

      <div className="col-span-2 w-7/12">
        <InputField
          placeholder="Referral Code (if any)"
          value={formData["Referral Code"] || ""}
          onChange={(e) => updateFormData({ "Referral Code": e.target.value })}
        />
      </div>
    </div>
  );
}