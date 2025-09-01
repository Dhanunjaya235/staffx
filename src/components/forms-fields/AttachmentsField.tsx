import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { FileText, Trash2, Download } from 'lucide-react';

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string; // base64 encoded
}

interface AttachmentsFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  accept?: string; // e.g. 'application/pdf,.doc,.docx'
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function fileToAttachment(file: File): Promise<AttachmentValue> {
  const buffer = await file.arrayBuffer();
  return {
    filename: file.name,
    filetype: file.type || 'application/octet-stream',
    filedata: arrayBufferToBase64(buffer),
  };
}

function downloadAttachment(att: AttachmentValue) {
  const link = document.createElement('a');
  link.href = `data:${att.filetype};base64,${att.filedata}`;
  link.download = att.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const AttachmentsField = <TFieldValues extends FieldValues = FieldValues>({ control, name, label = 'Attachments', accept = 'application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' }: AttachmentsFieldProps<TFieldValues>) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const value: AttachmentValue[] = Array.isArray(field.value) ? field.value : [];

          const handleFilesSelected = async (files: FileList | null) => {
            if (!files || files.length === 0) return;
            const converts = await Promise.all(Array.from(files).map(fileToAttachment));
            field.onChange([...(value || []), ...converts]);
          };

          const handleRemove = (idx: number) => {
            const next = [...value];
            next.splice(idx, 1);
            field.onChange(next);
          };

          return (
            <div>
              <input
                type="file"
                accept={accept}
                multiple
                onChange={async (e) => {
                  await handleFilesSelected(e.target.files);
                  if (e.target) {
                    e.target.value = '';
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldState.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} bg-white`}
              />

              {fieldState.error && (
                <p className="mt-1 text-sm text-red-600">{String(fieldState.error.message)}</p>
              )}

              {value && value.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {value.map((att, idx) => (
                    <div key={`${att.filename}-${idx}`} className="flex items-center p-3 border rounded-md bg-white shadow-sm">
                      <div className="flex-shrink-0 mr-3 text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{att.filename}</p>
                        <p className="text-xs text-gray-600 truncate">{att.filetype}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        <button type="button" title="Download" onClick={() => downloadAttachment(att)} className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none rounded">
                          <Download className="w-4 h-4" />
                        </button>
                        <button type="button" title="Remove" onClick={() => handleRemove(idx)} className="p-2 text-gray-500 hover:text-red-600 focus:outline-none rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default AttachmentsField;


