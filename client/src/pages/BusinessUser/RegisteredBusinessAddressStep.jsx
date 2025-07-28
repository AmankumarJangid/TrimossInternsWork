import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

export default function RegisteredBusinessAddressStep({ formData, updateFormData }) {
  return (
    <div className="grid grid-cols-2 gap-10">
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

      <InputField
        placeholder="State"
        value={formData["State"] || ""}
        onChange={(e) => updateFormData({ State: e.target.value })}
      />

      <InputField
        placeholder="City"
        value={formData["City"] || ""}
        onChange={(e) => updateFormData({ City: e.target.value })}
      />

      <InputField
        placeholder="Zip Code"
        value={formData["Zip Code"] || ""}
        onChange={(e) => updateFormData({ "Zip Code": e.target.value })}
      />

      <SelectField
      placeholder={"Monthly Purchase Volume"}
        options={["Below ₹10K", "₹10K - ₹50K", "₹50K - ₹1L", "Above ₹1L"]}
        value={formData["Monthly Purchase Volume"] || ""}
        onChange={(e) => updateFormData({ "Monthly Purchase Volume": e.target.value })}
      />

      <div className="col-span-2 w-7/12">
        <SelectField
          placeholder={"Shipping Address"}
          options={["Same as Registered", "Different"]}
          value={formData["Shipping Address"] || ""}
          onChange={(e) => updateFormData({ "Shipping Address": e.target.value })}
        />
      </div>
    </div>
  );
}