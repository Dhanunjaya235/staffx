import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../forms-fields/TextField';
import SelectField from '../forms-fields/SelectField';
import AttachmentsField, { AttachmentValue } from '../forms-fields/AttachmentsField';

export interface JobFormValues {
  title: string;
  clientId: string;
  roleId: string;
  description: string;
  deadline?: string;
  status?: string;
  attachments?: AttachmentValue[];
}

export interface OptionLike {
  id: string;
  name?: string;
  company?: string;
}

export interface JobFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<JobFormValues>;
  clients: OptionLike[];
  roles: OptionLike[];
  onSubmit: (values: JobFormValues) => void | Promise<void>;
  onCancel?: () => void;
  onCreateClient?: (setClientId: (id: string) => void) => void;
  onCreateRole?: (setRoleId: (id: string) => void) => void;
  includeStatus?: boolean;
  submitLabel?: string;
}

const schemaBase = yup.object({
  title: yup.string().required('Title is required'),
  clientId: yup.string().required('Client is required'),
  roleId: yup.string().required('Role is required'),
  description: yup.string().required('Description is required'),
  deadline: yup.string().nullable(),
});

const JobForm: React.FC<JobFormProps> = ({
  mode = 'create',
  defaultValues,
  clients,
  roles,
  onSubmit,
  onCancel,
  onCreateClient,
  onCreateRole,
  includeStatus = false,
  submitLabel,
}) => {
  const schema = includeStatus
    ? schemaBase.shape({ status: yup.string().required('Status is required') })
    : schemaBase;

  const { control, handleSubmit, setValue } = useForm<JobFormValues>({
    defaultValues: {
      title: '',
      clientId: '',
      roleId: '',
      description: '',
      deadline: '',
      status: includeStatus ? 'Open' : undefined,
      attachments: [],
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const handleCreateClient = () => {
    if (onCreateClient) onCreateClient((id) => setValue('clientId', id));
  };

  const handleCreateRole = () => {
    if (onCreateRole) onCreateRole((id) => setValue('roleId', id));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <TextField control={control} name="title" label="Job Title" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
        <div className="flex space-x-2">
          <SelectField
            control={control}
            name="clientId"
            label=""
            options={clients as any}
            displayKey={'company' as any}
            valueKey={'id' as any}
          />
          {onCreateClient && (
            <Button type="button" variant="secondary" onClick={handleCreateClient}>
              New Client
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
        <div className="flex space-x-2">
          <SelectField
            control={control}
            name="roleId"
            label=""
            options={roles as any}
            displayKey={'name' as any}
            valueKey={'id' as any}
          />
          {onCreateRole && (
            <Button type="button" variant="secondary" onClick={handleCreateRole}>
              New Role
            </Button>
          )}
        </div>
      </div>

      {includeStatus && (
        <SelectField control={control} name="status" label="Status" options={["Open","In Progress","Closed"] as any} />
      )}

      <TextField control={control} name="description" label="Description" />
      <TextField control={control} name="deadline" label="Deadline" type="date" />

      <AttachmentsField control={control} name="attachments" label="Attachments (PDF/Word)" />

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {submitLabel || (mode === 'edit' ? 'Update Job' : 'Create Job')}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;


