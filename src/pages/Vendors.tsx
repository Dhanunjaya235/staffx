import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addVendor } from '../store/slices/vendorsSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '../components/forms-fields/TextField';
import SelectField from '../components/forms-fields/SelectField';
import FileUploadField from '../components/forms-fields/FileUploadField';
import { useApi } from '../hooks/useApi';
import { vendorsApi } from '../services/api/vendorsApi';
import { setVendors } from '../store/slices/vendorsSlice';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Dropdown from '../components/UI/Dropdown/Dropdown';
import { Truck, Plus, Users, Edit } from 'lucide-react';
import Resources from './Resources';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
import ResourceDetails from './ResourceDetails';

const Vendors: React.FC = () => {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state: RootState) => state.vendors);
  const { openDrawer } = useDrawer();
  const createVendorApi = useApi(vendorsApi.create);
  const getVendorsApi = useApi(vendorsApi.getAll);

  const [viewLevel, setViewLevel] = React.useState<'vendors' | 'resources' | 'resourceDetails'>('vendors');
  const [selectedVendorId, setSelectedVendorId] = React.useState<string | undefined>(undefined);
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | undefined>(undefined);
  const [selectedResourceName, setSelectedResourceName] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      const res = await getVendorsApi.execute();
      dispatch(setVendors(res));
    })();
  }, [dispatch]);

  const columns = [
    { key: 'company', label: 'Company Name', filterable: true },
    { key: 'name', label: 'Contact Name', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'phone', label: 'Phone', filterable: true },
    { key: 'industry', label: 'Industry', filterable: true, filterOptions: ['Staffing', 'Consulting', 'Technology', 'Healthcare'] },
    {
      key: 'resourcesCount',
      label: 'Resources',
      render: (count: number, vendor: any) => (
        <button
          onClick={() => {
            setSelectedVendorId(vendor.id);
            setViewLevel('resources');
          }}
          className="flex items-center text-cyan-600 hover:text-cyan-800 font-medium"
        >
          <Users className="w-4 h-4 mr-1" />
          {count}
        </button>
      )
    },
    { key: 'createdAt', label: 'Created Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, vendor: any) => (
        <div className="space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openEditVendorDrawer(vendor)}
            icon={Edit}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => openAddResourceDrawer(vendor)}
            icon={Plus}
          >
            Add Resource
          </Button>
        </div>
      )
    }
  ];

  const openCreateVendorDrawer = () => {
    openDrawer({
      title: 'Create New Vendor',
      content: <CreateVendorForm onVendorCreated={handleVendorCreated} />,
      onClose: () => {}
    });
  };

  const openEditVendorDrawer = (vendor: any) => {
    openDrawer({
      title: `Edit Vendor - ${vendor.company}`,
      content: <EditVendorForm vendor={vendor} onVendorUpdated={handleVendorUpdated} />,
      onClose: () => {}
    });
  };
  const openAddResourceDrawer = (vendor: any) => {
    openDrawer({
      title: `Add Resource for ${vendor.company}`,
      content: <AddResourceForm vendor={vendor} />,
      onClose: () => {}
    });
  };

  const handleVendorCreated = async (vendorData: any) => {
    try {
      const newVendor = await createVendorApi.execute(vendorData);
      dispatch(addVendor(newVendor));
    } catch (error) {
      console.error('Failed to create vendor:', error);
    }
  };

  const handleVendorUpdated = async (vendorData: any) => {
    try {
      // Would normally call update API here
      console.log('Updating vendor:', vendorData);
    } catch (error) {
      console.error('Failed to update vendor:', error);
    }
  };
  if (viewLevel === 'resourceDetails' && selectedVendorId && selectedResourceId) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb
            home={{ label: 'Home', onClick: () => { setViewLevel('vendors'); setSelectedVendorId(undefined); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } }}
            items={[
              { label: 'Vendors', onClick: () => { setViewLevel('vendors'); setSelectedVendorId(undefined); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } },
              { label: 'Resources', onClick: () => { setViewLevel('resources'); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } },
              ...(selectedResourceName ? [{ label: selectedResourceName }] : []),
            ]}
          />
        </div>
        <ResourceDetails embedded resourceId={selectedResourceId} showBreadcrumb={false} />
      </div>
    );
  }

  if (viewLevel === 'resources' && selectedVendorId) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb
            home={{ label: 'Home', onClick: () => { setViewLevel('vendors'); setSelectedVendorId(undefined); } }}
            items={[
              { label: 'Vendors', onClick: () => setViewLevel('vendors') },
              { label: 'Resources' },
            ]}
          />
        </div>
        <Resources
          embedded
          showBreadcrumb={false}
          breadcrumbItems={[
            { label: 'Vendors', onClick: () => setViewLevel('vendors') },
            { label: 'Resources' },
          ]}
          onOpenResourceDetails={(resource) => {
            setSelectedResourceId(resource?.id);
            setSelectedResourceName(resource?.name);
            setViewLevel('resourceDetails');
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="mt-2 text-gray-600">Manage your vendor partnerships</p>
        </div>
        <Button
          onClick={openCreateVendorDrawer}
          icon={Plus}
          iconPosition="left"
        >
          Add Vendor
        </Button>
      </div>

      <Table
        data={vendors}
        columns={columns}
        emptyMessage="No vendors found. Create your first vendor partnership to get started."
      />
    </div>
  );
};

interface CreateVendorFormProps {
  onVendorCreated: (vendor: any) => void;
}

const CreateVendorForm: React.FC<CreateVendorFormProps> = ({ onVendorCreated }) => {
  const createVendor = useApi(vendorsApi.create);

  const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    company: yup.string().required('Company is required'),
    industry: yup.string().required('Industry is required'),
    location: yup.string().nullable(),
    logo: yup.mixed().nullable(),
    contacts: yup.array().of(
      yup.object({
        name: yup.string().required('Contact name is required'),
        role: yup.string().required('Role is required'),
        phone: yup.string().required('Phone is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
      })
    ).default([]),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: { name: '', email: '', phone: '', company: '', industry: '', location: '', logo: null, contacts: [] as any[] },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' });

  const onSubmit = async (values: any) => {
    const res = await createVendor.execute(values);
    onVendorCreated({ ...values, resourcesCount: 0, createdAt: new Date().toISOString().split('T')[0], id: res.id || Date.now().toString() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <TextField control={control} name="name" label="Contact Name" />
      <TextField control={control} name="email" label="Email" type="email" />
      <TextField control={control} name="phone" label="Phone" type="tel" />
      <TextField control={control} name="company" label="Company" />
      <SelectField control={control} name="industry" label="Industry" options={["Staffing","Consulting","Technology","Healthcare"]} />
      <TextField control={control} name="location" label="Location" />
      <FileUploadField control={control} name="logo" label="Vendor Logo" accept="image/*" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Contacts</label>
          <Button type="button" variant="secondary" size="sm" onClick={() => append({ name: '', role: '', phone: '', email: '' })}>Add Contact</Button>
        </div>
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-2 gap-4 border p-3 rounded">
              <TextField control={control} name={`contacts.${idx}.name`} label="Name" />
              <TextField control={control} name={`contacts.${idx}.role`} label="Role" />
              <TextField control={control} name={`contacts.${idx}.phone`} label="Phone" />
              <TextField control={control} name={`contacts.${idx}.email`} label="Email" />
              <div className="col-span-2 flex justify-end">
                <Button type="button" variant="secondary" size="sm" onClick={() => remove(idx)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">Create Vendor</Button>
      </div>
    </form>
  );
};

interface EditVendorFormProps {
  vendor: any;
  onVendorUpdated: (vendor: any) => void;
}

const EditVendorForm: React.FC<EditVendorFormProps> = ({ vendor, onVendorUpdated }) => {
  const [formData, setFormData] = React.useState({
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone,
    company: vendor.company,
    industry: vendor.industry
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedVendor = {
      ...vendor,
      ...formData
    };
    onVendorUpdated(updatedVendor);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <Dropdown
          options={['Staffing', 'Consulting', 'Technology', 'Healthcare']}
          value={formData.industry}
          onChange={(value) => setFormData({ ...formData, industry: value as string })}
          placeholder="Select Industry"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Update Vendor
        </Button>
      </div>
    </form>
  );
};
interface AddResourceFormProps {
  vendor: any;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ vendor }) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    experience: '',
    skills: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding resource for vendor:', { ...formData, vendor });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="bg-cyan-50 p-4 rounded-md">
        <h4 className="font-medium text-cyan-900">Vendor: {vendor.company}</h4>
        <p className="text-sm text-cyan-600">{vendor.name} • {vendor.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job
        </label>
        <Dropdown
          options={jobs}
          displayKey="title"
          value={formData.jobId}
          onChange={(value) => setFormData({ ...formData, jobId: (value as any)?.id || '' })}
          placeholder="Select Job"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience (years)
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Add Resource
        </Button>
      </div>
    </form>
  );
};

export default Vendors;