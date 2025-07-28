import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";


export default function GeneralInfoStep({ formData, updateFormData }) {
  return (
    <div className="grid grid-cols-2 gap-9">
      <div className="col-span-1">
        <SelectField
        disabled={true}
          options={["Individual", "Business Customer"]}
          value={formData["User Type"] || ""}
          onChange={(e) => updateFormData({ "User Type": e.target.value })}
        />
      </div>

      <div className="col-span-2">
        <InputField
          placeholder="Email Address (Pre Filled)"
          value={formData["Email Address"] || ""}
          onChange={(e) => updateFormData({ "Email Address": e.target.value })}
        />
      </div>

      <SelectField
      placeholder={"Country"}
        options={["India", "USA", "UK"]}
        value={formData["Country"] || ""}
        onChange={(e) => updateFormData({ Country: e.target.value })}
      />

      <InputField
        placeholder="Mobile number"
        value={formData["Mobile Number"] || ""}
        onChange={(e) => updateFormData({ "Mobile Number": e.target.value })}
      />

      <SelectField
      placeholder={"Preferred Currency"}
        options={["INR", "USD", "GBP"]}
        value={formData["Preferred Currency"] || ""}
        onChange={(e) => updateFormData({ "Preferred Currency": e.target.value })}
      />

      <SelectField
        options={["English", "Hindi", "French"]}
        value={formData["Language"] || ""}
        onChange={(e) => updateFormData({ Language: e.target.value })}
      />

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