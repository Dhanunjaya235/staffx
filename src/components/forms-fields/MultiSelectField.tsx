import React from 'react';
import { Controller, Control } from 'react-hook-form';

interface MultiSelectFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ control, name, label, options, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const values: string[] = Array.isArray(field.value) ? field.value : [];
          const toggle = (value: string) => {
            const next = values.includes(value) ? values.filter(v => v !== value) : [...values, value];
            field.onChange(next);
          };
          return (
            <>
              <div className={`w-full px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {values.map((v) => (
                    <span key={v} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {v}
                      <button type="button" className="ml-1" onClick={() => toggle(v)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={values.includes(opt)} onChange={() => toggle(opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {fieldState.error && (
                <p className="mt-1 text-sm text-red-600">{fieldState.error.message as string}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default MultiSelectField;

