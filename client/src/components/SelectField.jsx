// components/SelectField.jsx
export default function SelectField({ options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-full text-black bg-white focus:outline-none shadow"
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
