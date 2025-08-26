import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { addVendor } from '../store/slices/vendorsSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import { useApi } from '../hooks/useApi';
import { vendorsApi } from '../services/api';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import { Truck, Plus, Users, Edit } from 'lucide-react';

const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vendors } = useSelector((state: RootState) => state.vendors);
  const { openDrawer } = useDrawer();
  const createVendorApi = useApi(vendorsApi.create);

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
          onClick={() => navigate(`/resources?vendor=${vendor.id}`)}
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
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor = {
      ...formData,
      resourcesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onVendorCreated(newVendor);
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
        <select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          <option value="">Select Industry</option>
          <option value="Staffing">Staffing</option>
          <option value="Consulting">Consulting</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Create Vendor
        </Button>
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
        <select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          <option value="">Select Industry</option>
          <option value="Staffing">Staffing</option>
          <option value="Consulting">Consulting</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
        </select>
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
        <select
          name="jobId"
          value={formData.jobId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          <option value="">Select Job</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.clientName}
            </option>
          ))}
        </select>
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