import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../forms-fields/TextField';
import SelectField from '../forms-fields/SelectField';
import MultiSelectField from '../forms-fields/MultiSelectField';
import FileUploadField from '../forms-fields/FileUploadField';
import AttachmentsField, { AttachmentValue } from '../forms-fields/AttachmentsField';
import { useDrawer } from '../UI/Drawer/DrawerProvider';

export interface ResourceCreateValues {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  resourceType: 'Cognine'|'Contract'|'Vendor'|'Direct'|'';
  experience: number;
  skills: string[];
  vendorId?: string;
  resume?: any;
  attachments?: AttachmentValue[];
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  jobId: yup.string().required('Job is required'),
  resourceType: yup.mixed<'Cognine'|'Contract'|'Vendor'|'Direct'>().oneOf(['Cognine','Contract','Vendor','Direct']).required('Type is required'),
  experience: yup.number().typeError('Experience must be a number').min(0).required('Experience is required'),
  skills: yup.array().of(yup.string()).min(1, 'Select at least one skill'),
  vendorId: yup.string().when('resourceType', {
    is: 'Vendor',
    then: (s) => s.required('Vendor is required'),
    otherwise: (s) => s.optional(),
  }),
  resume: yup.mixed().nullable(),
  attachments: yup.array().of(
    yup.object({ filename: yup.string().required(), filetype: yup.string().required(), filedata: yup.string().required() })
  ).optional(),
});

interface ResourceCreateFormProps {
  onCreateJob: (setJobId: (id: string) => void) => void;
  onCreateVendor: (setVendorId: (id: string) => void) => void;
  onSubmit: (values: any) => Promise<void> | void;
}

const ResourceCreateForm: React.FC<ResourceCreateFormProps> = ({ onCreateJob, onCreateVendor, onSubmit }) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { vendors } = useSelector((state: RootState) => state.vendors);
  const { control, handleSubmit, watch, setValue } = useForm<ResourceCreateValues>({
    defaultValues: { name: '', email: '', phone: '', jobId: '', resourceType: '' as any, experience: 0, skills: [] as string[], vendorId: '', resume: null as any, attachments: [] },
    resolver: yupResolver(schema),
  });

  const skillsOptions = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'];

  const selectedJobId = watch('jobId');
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <TextField control={control} name="name" label="Full Name" />
        <TextField control={control} name="email" label="Email" type="email" />
      </div>
      <TextField control={control} name="phone" label="Phone" type="tel" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job</label>
        <div className="flex space-x-2">
          <SelectField control={control} name="jobId" label="" options={jobs as any} displayKey={'title' as any} valueKey={'id' as any} />
          <Button type="button" variant="secondary" onClick={() => onCreateJob((id) => setValue('jobId', id))}>New Job</Button>
        </div>
        {selectedJob && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700"><strong>Client:</strong> {selectedJob.clientName}</p>
          </div>
        )}
      </div>

      <SelectField control={control} name="resourceType" label="Resource Type" options={["Cognine","Contract","Vendor","Direct"]} />

      {watch('resourceType') === 'Vendor' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
          <div className="flex space-x-2">
            <SelectField control={control} name="vendorId" label="" options={vendors as any} displayKey={'company' as any} valueKey={'id' as any} />
            <Button type="button" variant="secondary" onClick={() => onCreateVendor((id) => setValue('vendorId', id))}>New Vendor</Button>
          </div>
        </div>
      )}

      <TextField control={control} name="experience" label="Experience (years)" type="number" />
      <MultiSelectField control={control} name="skills" label="Skills" options={skillsOptions} />
      <FileUploadField control={control as any} name="resume" label="Resume" accept="application/pdf,.doc,.docx" />
      <AttachmentsField control={control} name="attachments" label="Attachments (PDF/Word)" />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">Create Resource</Button>
      </div>
    </form>
  );
};

export default ResourceCreateForm;


