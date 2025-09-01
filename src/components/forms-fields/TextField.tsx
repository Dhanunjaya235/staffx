import React from 'react';
import { Controller, Control } from 'react-hook-form';

interface TextFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ control, name, label, type = 'text', placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldState.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {fieldState.error && (
              <p className="mt-1 text-sm text-red-600">{fieldState.error.message as string}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default TextField;

