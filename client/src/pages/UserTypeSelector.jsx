import { useState } from "react";
import DynamicFormPage from "./DynamicForm/DynamicFormPage";
import BusinessUserForm from "./BusinessUser/BusinessUserForm";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import logo from "../assets/Images/logo.png";
import product1 from "../assets/Images/product1.jpg";
import product2 from "../assets/Images/product2.jpg";

const bgImages = [product1, product2];

export default function UserTypeSelector() {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const handleSubmit = () => {
    if (userType && name) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return userType === "Individual" ? (
      <DynamicFormPage userType={userType}/>
    ) : (
      <BusinessUserForm userType={userType} />
    );
  }

  return (
 <div className="flex min-h-screen">
      <div className="w-1/3  bg-white  border-r  justify-center items-center">
        <div className="flex flex-col items-center mt-10">
          <img src={logo} alt="Logo" className="w-[400px] ml-5 " />

          <h1 className="text-4xl font-bold text-black mb-1">Sign Up</h1>
          <div className="w-24 h-1 bg-black my-3 rounded-full"></div>
        <div className="mt-5 text-lg font-semibold text-gray-500">General Info</div>
      </div>
      </div>
      <div className="w-2/3 flex justify-center items-center p-12 relative">
        <div
          className="w-[640px] h-[570px] p-8 rounded-[30px] mb-15 text-white bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
        >
          <div className="  p-8 rounded-xl h-full flex flex-col  space-y-4">
           <div className="w-6/12">
            <SelectField
            placeholder={"Type"}
              options={["Individual",  "Business/Designer/Distributor/Architect/Other"]}
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            />
            </div>
            <InputField
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={() => {
                setBgIndex((prev) => (prev + 1) % bgImages.length);
                handleSubmit();
              }}
              className="mt-6 px-6 py-2 bg-white text-black rounded-full font-bold w-fit self-end"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
