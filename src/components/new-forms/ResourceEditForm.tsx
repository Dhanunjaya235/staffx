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
import AttachmentsField, { AttachmentValue } from '../forms-fields/AttachmentsField';

export interface ResourceEditValues {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  interviewStatus: string;
  resourceType: 'Cognine'|'Contract'|'Vendor'|'Direct';
  experience: number;
  skills: string[];
  attachments?: AttachmentValue[];
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  jobId: yup.string().required('Job is required'),
  interviewStatus: yup.string().required('Status is required'),
  resourceType: yup.mixed<'Cognine'|'Contract'|'Vendor'|'Direct'>().oneOf(['Cognine','Contract','Vendor','Direct']).required('Type is required'),
  experience: yup.number().typeError('Experience must be a number').min(0).required('Experience is required'),
  skills: yup.array().of(yup.string()).min(1, 'Select at least one skill'),
  attachments: yup.array().of(
    yup.object({ filename: yup.string().required(), filetype: yup.string().required(), filedata: yup.string().required() })
  ).optional(),
});

interface ResourceEditFormProps {
  resource: any;
  onSubmit: (values: any) => Promise<void> | void;
}

const ResourceEditForm: React.FC<ResourceEditFormProps> = ({ resource, onSubmit }) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { control, handleSubmit } = useForm<ResourceEditValues>({
    defaultValues: {
      name: resource.name,
      email: resource.email,
      phone: resource.phone,
      jobId: resource.jobId,
      interviewStatus: resource.interviewStatus,
      resourceType: resource.resourceType,
      experience: resource.experience,
      skills: resource.skills,
      attachments: resource.attachments || [],
    },
    resolver: yupResolver(schema),
  });

  const skillsOptions = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <TextField control={control} name="name" label="Full Name" />
        <TextField control={control} name="email" label="Email" type="email" />
      </div>
      <TextField control={control} name="phone" label="Phone" type="tel" />
      <SelectField control={control} name="jobId" label="Job" options={jobs as any} displayKey={'title' as any} valueKey={'id' as any} />
      <SelectField control={control} name="interviewStatus" label="Interview Status" options={["Not Started","In Progress","Passed","Failed","On Hold"]} />
      <SelectField control={control} name="resourceType" label="Resource Type" options={["Cognine","Contract","Vendor","Direct"]} />
      <TextField control={control} name="experience" label="Experience (years)" type="number" />
      <MultiSelectField control={control} name="skills" label="Skills" options={skillsOptions} />
      <AttachmentsField control={control} name="attachments" label="Attachments (PDF/Word)" />
      <div className="flex justify-end">
        <Button type="submit" variant="primary">Update Resource</Button>
      </div>
    </form>
  );
};

export default ResourceEditForm;


