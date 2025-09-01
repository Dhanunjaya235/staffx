import React from 'react';
import { Controller, Control } from 'react-hook-form';

export interface FileValue {
  fileName: string;
  fileType: string;
  fileValue: string; // base64 data (without prefix)
}

interface FileUploadFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  accept?: string;
}

async function toBase64(file: File): Promise<FileValue> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return {
    fileName: file.name,
    fileType: file.type,
    fileValue: base64,
  };
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ control, name, label, accept }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <input
              type="file"
              accept={accept}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const encoded = await toBase64(file);
                  field.onChange(encoded);
                } else {
                  field.onChange(null);
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldState.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {field.value?.fileName && (
              <p className="mt-2 text-sm text-gray-600">Selected: {field.value.fileName}</p>
            )}
            {fieldState.error && (
              <p className="mt-1 text-sm text-red-600">{fieldState.error.message as string}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FileUploadField;

