import { useState } from "react";
import GeneralInfoStep from "./GeneralInfoStep";
import AddressInfoStep from "./AddressInforStep";
import product1 from "../../assets/Images/product1.jpg";
import product2 from "../../assets/Images/product2.jpg";
import logo from "../../assets/Images/logo.png";
const steps = ["General Info", "Address Info"];
const bgImages = [product1, product2];

export default function DynamicFormPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [bgIndex, setBgIndex] = useState(0);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    setBgIndex((prev) => (prev + 1) % bgImages.length);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    setBgIndex((prev) => (prev + 1) % bgImages.length);
  };

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <GeneralInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <AddressInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">

      <div className="w-1/3  bg-white  border-r  justify-center items-center">
        <div className="flex flex-col items-center mt-10">
          <img src={logo} alt="Logo" className="w-[400px] ml-5 " />
          <h1 className="text-4xl font-bold text-black mb-1">Sign Up</h1>
          <div className="w-24 h-1 bg-black my-3 rounded-full"></div>
          <div className="mt-5 flex flex-col items-center space-y-4">
            {steps.map((title, idx) => (
              <div
                key={idx}
                className={`text-lg ${
                  idx === stepIndex ? "font-bold text-black" : "text-gray-400"
                }`}
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="w-2/3 flex mb-15 justify-center items-center p-12 relative">
        <div
          className="w-[670px] h-[570px] p-8 rounded-4xl text-white bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
        >
          <div className=" bg-opacity-50 p-8 rounded-xl h-full overflow-auto">
            {renderStep()}
            <div className="flex justify-between mt-6">
              {stepIndex > 0 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-white text-black rounded-full border"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-white text-black rounded-full font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
