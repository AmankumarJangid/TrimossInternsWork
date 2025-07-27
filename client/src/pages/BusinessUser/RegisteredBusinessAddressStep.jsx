import InputField from "../../components/InputField";

export default function RegisteredBusinessAddressStep({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <InputField
        placeholder="Registered Street Address"
        value={formData["Registered Street"] || ""}
        onChange={(e) => updateFormData({ "Registered Street": e.target.value })}
      />

      <InputField
        placeholder="City"
        value={formData["Business City"] || ""}
        onChange={(e) => updateFormData({ "Business City": e.target.value })}
      />

      <InputField
        placeholder="State"
        value={formData["Business State"] || ""}
        onChange={(e) => updateFormData({ "Business State": e.target.value })}
      />

      <InputField
        placeholder="Postal Code"
        value={formData["Business Postal Code"] || ""}
        onChange={(e) => updateFormData({ "Business Postal Code": e.target.value })}
      />
    </div>
  );
}