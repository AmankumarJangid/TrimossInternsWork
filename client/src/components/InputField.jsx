// components/InputField.jsx
export default function InputField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 rounded-full text-black bg-white focus:outline-none shadow"
    />
  );
}
