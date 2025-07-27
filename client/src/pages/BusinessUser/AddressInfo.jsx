import InputField from "../../components/InputField";

export default function AddressInfoStep({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <InputField
        placeholder="Street Address"
        value={formData["Street"] || ""}
        onChange={(e) => updateFormData({ Street: e.target.value })}
      />
      <InputField
        placeholder="City"
        value={formData["City"] || ""}
        onChange={(e) => updateFormData({ City: e.target.value })}
      />
      <InputField
        placeholder="State"
        value={formData["State"] || ""}
        onChange={(e) => updateFormData({ State: e.target.value })}
      />
      <InputField
        placeholder="Postal Code"
        value={formData["Postal Code"] || ""}
        onChange={(e) => updateFormData({ "Postal Code": e.target.value })}
      />
    </div>
  );
}
