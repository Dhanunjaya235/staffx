import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
import { Plus, Edit, Eye, User } from 'lucide-react';

const Resources: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientFilter = searchParams.get('client');
  const jobFilter = searchParams.get('job');
  
  const { resources } = useSelector((state: RootState) => state.resources);
  const { clients } = useSelector((state: RootState) => state.clients);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { openDrawer } = useDrawer();

  let filteredResources = resources;
  if (clientFilter) {
    filteredResources = filteredResources.filter(r => r.clientId === clientFilter);
  }
  if (jobFilter) {
    filteredResources = filteredResources.filter(r => r.jobId === jobFilter);
  }

  const clientName = clientFilter 
    ? clients.find(c => c.id === clientFilter)?.company 
    : null;
  
  const jobName = jobFilter 
    ? jobs.find(j => j.id === jobFilter)?.title 
    : null;

  const breadcrumbItems = [
    { label: 'Resources', path: '/resources' },
    ...(clientName ? [{ label: clientName }] : []),
    ...(jobName ? [{ label: jobName }] : [])
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Candidate Name', 
      filterable: true,
      render: (name: string, resource: any) => (
        <button
          onClick={() => navigate(`/resources/${resource.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {name}
        </button>
      )
    },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'clientName', label: 'Client', filterable: true },
    { key: 'jobTitle', label: 'Job', filterable: true },
    { 
      key: 'resourceType', 
      label: 'Type', 
      filterable: true,
      filterOptions: ['Self', 'Freelancer', 'Vendor', 'Direct'],
      render: (type: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          type === 'Self' ? 'bg-blue-100 text-blue-800' :
          type === 'Freelancer' ? 'bg-green-100 text-green-800' :
          type === 'Vendor' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {type}
        </span>
      )
    },
    { 
      key: 'interviewStatus', 
      label: 'Status', 
      filterable: true,
      filterOptions: ['Not Started', 'In Progress', 'Passed', 'Failed', 'On Hold'],
      render: (status: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'Passed' ? 'bg-green-100 text-green-800' :
          status === 'Failed' ? 'bg-red-100 text-red-800' :
          status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
          status === 'On Hold' ? 'bg-gray-100 text-gray-800' :
          'bg-slate-100 text-slate-800'
        }`}>
          {status}
        </span>
      )
    },
    { key: 'roundsCount', label: 'Rounds' },
    { key: 'experience', label: 'Experience (years)' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, resource: any) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/resources/${resource.id}`)}
            icon={Eye}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openEditResourceDrawer(resource)}
            icon={Edit}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  const openCreateResourceDrawer = () => {
    openDrawer({
      title: 'Create New Resource',
      content: <CreateResourceForm />,
      onClose: () => {}
    });
  };

  const openEditResourceDrawer = (resource: any) => {
    openDrawer({
      title: `Edit Resource - ${resource.name}`,
      content: <EditResourceForm resource={resource} />,
      onClose: () => {}
    });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resources {clientName && `for ${clientName}`} {jobName && `- ${jobName}`}
          </h1>
          <p className="mt-2 text-gray-600">Manage candidates and their interview progress</p>
        </div>
        <Button
          onClick={openCreateResourceDrawer}
          icon={Plus}
          iconPosition="left"
        >
          Add Resource
        </Button>
      </div>

      <Table
        data={filteredResources}
        columns={columns}
        emptyMessage="No resources found. Add your first candidate to get started."
      />
    </div>
  );
};

const CreateResourceForm: React.FC = () => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { clients } = useSelector((state: RootState) => state.clients);
  const { vendors } = useSelector((state: RootState) => state.vendors);
  const { openDrawer } = useDrawer();

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    resourceType: '',
    experience: '',
    skills: '',
    vendorId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating resource:', formData);
  };

  const selectedJob = jobs.find(j => j.id === formData.jobId);

  const openCreateJobDrawer = () => {
    openDrawer({
      title: 'Create New Job',
      content: <CreateJobForm onJobCreated={(job) => setFormData({...formData, jobId: job.id})} />,
      onClose: () => {}
    });
  };

  const openCreateVendorDrawer = () => {
    openDrawer({
      title: 'Create New Vendor',
      content: <CreateVendorForm onVendorCreated={(vendor) => setFormData({...formData, vendorId: vendor.id})} />,
      onClose: () => {}
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job
        </label>
        <div className="flex space-x-2">
          <select
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Job</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.clientName}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            onClick={openCreateJobDrawer}
            icon={Plus}
          >
            New Job
          </Button>
        </div>
        {selectedJob && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Client:</strong> {selectedJob.clientName}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resource Type
        </label>
        <select
          name="resourceType"
          value={formData.resourceType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Type</option>
          <option value="Self">Self</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Vendor">Vendor</option>
          <option value="Direct">Direct</option>
        </select>
      </div>

      {formData.resourceType === 'Vendor' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor
          </label>
          <div className="flex space-x-2">
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.company}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={openCreateVendorDrawer}
              icon={Plus}
            >
              New Vendor
            </Button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience (years)
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Create Resource
        </Button>
      </div>
    </form>
  );
};

// Create Vendor Form Component
const CreateVendorForm: React.FC<{ onVendorCreated: (vendor: any) => void }> = ({ onVendorCreated }) => {
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
      id: Date.now().toString(),
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
        <select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <Button type="submit" variant="primary">Create Vendor</Button>
      </div>
    </form>
  );
};
interface EditResourceFormProps {
  resource: any;
}

const EditResourceForm: React.FC<EditResourceFormProps> = ({ resource }) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);

  const [formData, setFormData] = React.useState({
    name: resource.name,
    email: resource.email,
    phone: resource.phone,
    jobId: resource.jobId,
    resourceType: resource.resourceType,
    experience: resource.experience.toString(),
    skills: resource.skills.join(', '),
    interviewStatus: resource.interviewStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating resource:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.clientName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Status
        </label>
        <select
          name="interviewStatus"
          value={formData.interviewStatus}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resource Type
        </label>
        <select
          name="resourceType"
          value={formData.resourceType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Self">Self</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Vendor">Vendor</option>
          <option value="Direct">Direct</option>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Update Resource
        </Button>
      </div>
    </form>
  );
};

// Simple placeholder for CreateJobForm - would be similar to Jobs page
const CreateJobForm: React.FC<{ onJobCreated: (job: any) => void }> = ({ onJobCreated }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    clientId: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onJobCreated(newJob);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">Create Job</Button>
      </div>
    </form>
  );
};

export default Resources;