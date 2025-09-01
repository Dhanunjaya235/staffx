import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../forms-fields/TextField';
import SelectField from '../forms-fields/SelectField';
import AttachmentsField, { AttachmentValue } from '../forms-fields/AttachmentsField';
import { roundsApi } from '../../services/api/roundsApi';
import { useApi } from '../../hooks/useApi';

export interface RoundCreateValues {
  roundType: string;
  interviewer: string;
  date: string;
  status: string;
  attachments?: AttachmentValue[];
}

interface RoundCreateFormProps {
  resource: { id: string; name?: string; jobTitle?: string; clientName?: string };
  defaultValues?: Partial<RoundCreateValues>;
  submitLabel?: string;
  onSubmitted?: (created: any) => void | Promise<void>;
}

const schema = yup.object({
  roundType: yup.string().required('Round type is required'),
  interviewer: yup.string().required('Interviewer is required'),
  date: yup.string().required('Date is required'),
  status: yup.string().required('Status is required'),
  attachments: yup.array().of(
    yup.object({
      filename: yup.string().required(),
      filetype: yup.string().required(),
      filedata: yup.string().required(),
    })
  ).optional(),
});

const RoundCreateForm: React.FC<RoundCreateFormProps> = ({ resource, defaultValues, submitLabel = 'Schedule Round', onSubmitted }) => {
  const createRound = useApi(roundsApi.create);

  const { control, handleSubmit } = useForm<RoundCreateValues>({
    defaultValues: {
      roundType: '',
      interviewer: '',
      date: '',
      status: 'Scheduled',
      attachments: [],
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: RoundCreateValues) => {
    const payload = {
      roundNumber: 1,
      roundType: values.roundType,
      interviewer: values.interviewer,
      date: values.date,
      status: values.status,
      feedback: undefined,
      resourceId: resource.id,
      attachments: values.attachments || [],
    };
    const res = await createRound.execute(payload);
    if (onSubmitted) await onSubmitted(res);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-900">Resource: {resource.name}</h4>
        {(resource.jobTitle || resource.clientName) && (
          <p className="text-sm text-gray-600">{resource.jobTitle} {resource.clientName ? `at ${resource.clientName}` : ''}</p>
        )}
      </div>

      <SelectField control={control} name="roundType" label="Round Type" options={["Phone Screen","Technical Interview","Behavioral Interview","Final Interview","Client Interview"]} />
      <TextField control={control} name="interviewer" label="Interviewer" />
      <TextField control={control} name="date" label="Interview Date" type="date" />
      <SelectField control={control} name="status" label="Status" options={["Scheduled","Completed","Passed","Failed","No Show"]} />

      <AttachmentsField control={control} name="attachments" label="Attachments (PDF/Word)" />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">{submitLabel}</Button>
      </div>
    </form>
  );
};

export default RoundCreateForm;


