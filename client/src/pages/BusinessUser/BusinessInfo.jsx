

import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

export default function BusinessInfoStep({ formData, updateFormData }) {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="col-span-2">
        <InputField
          placeholder="Business Name (Legal)"
          value={formData["Business Name"] || ""}
          onChange={(e) => updateFormData({ "Business Name": e.target.value })}
        />
      </div>

      <div className="col-span-2">
        <SelectField
        placeholder={"Business Type"}
          options={["Private Limited", "LLP", "Sole Proprietorship"]}
          value={formData["Business Type"] || ""}
          onChange={(e) => updateFormData({ "Business Type": e.target.value })}
        />
      </div>

      <SelectField
      placeholder={"Year of Establishment"}
        options={["2024", "2023", "2022", "2021"]}
        value={formData["Year of Establishment"] || ""}
        onChange={(e) => updateFormData({ "Year of Establishment": e.target.value })}
      />

      <SelectField
      placeholder={"Number of Employees"}
        options={["1-10", "11-50", "51-100", "100+"]}
        value={formData["Number of Employees"] || ""}
        onChange={(e) => updateFormData({ "Number of Employees": e.target.value })}
      />

      <div className="col-span-2">
        <SelectField
        placeholder={"Nature of Business"}
          options={["Manufacturing", "Retail", "Wholesale", "Services"]}
          value={formData["Nature of Business"] || ""}
          onChange={(e) => updateFormData({ "Nature of Business": e.target.value })}
        />
      </div>

      <div className="col-span-2">
        <InputField
          placeholder="Business Website (Optional)"
          value={formData["Business Website"] || ""}
          onChange={(e) => updateFormData({ "Business Website": e.target.value })}
        />
      </div>
    </div>
  );
}
