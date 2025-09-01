import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../forms-fields/TextField';
import SelectField from '../forms-fields/SelectField';

export interface ClientContactInput {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  contacts?: ClientContactInput[];
}

export interface ClientFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
  onCancel?: () => void;
  industries?: string[];
  includeContacts?: boolean;
  submitLabel?: string;
}

const baseSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  company: yup.string().required('Company is required'),
  industry: yup.string().required('Industry is required'),
});

const contactsSchema = yup
  .array()
  .of(
    yup.object({
      name: yup.string().required('Contact name is required'),
      role: yup.string().required('Contact role is required'),
      phone: yup.string().required('Contact phone is required'),
      email: yup.string().email('Invalid email').required('Contact email is required'),
    })
  )
  .min(1, 'At least one contact is required');

const ClientForm: React.FC<ClientFormProps> = ({
  mode = 'create',
  defaultValues,
  onSubmit,
  onCancel,
  industries = ['Technology', 'Consulting', 'Finance', 'Healthcare'],
  includeContacts = true,
  submitLabel,
}) => {
  const schema = includeContacts
    ? baseSchema.shape({ contacts: contactsSchema })
    : baseSchema;

  const { control, handleSubmit } = useForm<ClientFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      contacts: includeContacts ? [{ name: '', role: '', phone: '', email: '' }] : undefined,
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts' as const,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <TextField control={control} name="name" label="Contact Name" />
      <TextField control={control} name="email" label="Email" type="email" />
      <TextField control={control} name="phone" label="Phone" type="tel" />
      <TextField control={control} name="company" label="Company" />
      <SelectField control={control} name="industry" label="Industry" options={industries as any} />

      {includeContacts && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ name: '', role: '', phone: '', email: '' })}
            >
              Add Contact
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <TextField control={control} name={`contacts.${index}.name`} label="Name" />
                <TextField control={control} name={`contacts.${index}.role`} label="Role" />
                <TextField control={control} name={`contacts.${index}.phone`} label="Phone" />
                <TextField control={control} name={`contacts.${index}.email`} label="Email" type="email" />
              </div>
              <div className="flex justify-end">
                {fields.length > 1 && (
                  <Button type="button" variant="danger" onClick={() => remove(index)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {submitLabel || (mode === 'edit' ? 'Update Client' : 'Create Client')}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;


