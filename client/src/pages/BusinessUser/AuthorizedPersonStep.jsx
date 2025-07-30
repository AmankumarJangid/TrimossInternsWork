import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

export default function AuthorizedPersonStep({ formData, updateFormData }) {
  return (
    <div className="grid grid-cols-2 gap-10">
      <InputField
        placeholder="First Name"
        value={formData["First Name"] || ""}
        onChange={(e) => updateFormData({ "First Name": e.target.value })}
      />

      <InputField
        placeholder="Last Name"
        value={formData["Last Name"] || ""}
        onChange={(e) => updateFormData({ "Last Name": e.target.value })}
      />

      <SelectField
      placeholder={"Date Of Birth"}
        options={["1990", "1995", "2000", "2005"]}
        value={formData["Date Of Birth"] || ""}
        onChange={(e) => updateFormData({ "Date Of Birth": e.target.value })}
      />

      <InputField
        placeholder="Designation"
        value={formData["Designation"] || ""}
        onChange={(e) => updateFormData({ Designation: e.target.value })}
      />

      <div className="col-span-2">
        <InputField
          placeholder="E mail ID"
          value={formData["Email ID"] || ""}
          onChange={(e) => updateFormData({ "Email ID": e.target.value })}
        />
      </div>
      <div className="col-span-2 w-6/12">
        <InputField
          placeholder="Mobile number"
          value={formData["Mobile Number"] || ""}
          onChange={(e) => updateFormData({ "Mobile Number": e.target.value })}
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
