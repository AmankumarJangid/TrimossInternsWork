// components/SelectField.jsx
export default function SelectField({
  options,
  value,
  onChange,
  disabled = false,
  placeholder ,
}) {
  return (
    <select
      disabled={disabled}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-2 rounded-full text-black bg-white focus:outline-none shadow"
    >
       <option value="" disabled selected hidden>
        
          {placeholder}
        </option>
      {options.map((opt, idx) => (
        <option className="" key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
