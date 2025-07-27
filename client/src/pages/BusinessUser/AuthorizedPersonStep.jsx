import InputField from "../../components/InputField";

export default function AuthorizedPersonStep({ formData, updateFormData }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InputField
        placeholder="Authorized Person's Name"
        value={formData["Authorized Person"] || ""}
        onChange={(e) => updateFormData({ "Authorized Person": e.target.value })}
      />

      <InputField
        placeholder="Designation"
        value={formData["Designation"] || ""}
        onChange={(e) => updateFormData({ Designation: e.target.value })}
      />

      <InputField
        placeholder="Contact Email"
        value={formData["Contact Email"] || ""}
        onChange={(e) => updateFormData({ "Contact Email": e.target.value })}
      />

      <InputField
        placeholder="Contact Phone"
        value={formData["Contact Phone"] || ""}
        onChange={(e) => updateFormData({ "Contact Phone": e.target.value })}
      />
    </div>
  );
}