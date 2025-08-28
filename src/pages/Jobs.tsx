import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
import Dropdown from '../components/UI/Dropdown/Dropdown';
import { Plus, Edit, Users } from 'lucide-react';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientFilter = searchParams.get('client');
  
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { clients } = useSelector((state: RootState) => state.clients);
  const { openDrawer } = useDrawer();

  const filteredJobs = clientFilter 
    ? jobs.filter(job => job.clientId === clientFilter)
    : jobs;

  const clientName = clientFilter 
    ? clients.find(c => c.id === clientFilter)?.company 
    : null;

  const breadcrumbItems = [
    { label: 'Jobs', path: '/jobs' },
    ...(clientName ? [{ label: clientName }] : [])
  ];

  const columns = [
    { key: 'title', label: 'Job Title', filterable: true },
    { key: 'clientName', label: 'Client', filterable: true },
    { key: 'roleName', label: 'Role', filterable: true },
    { 
      key: 'status', 
      label: 'Status', 
      filterable: true,
      filterOptions: ['Open', 'In Progress', 'Closed'],
      render: (status: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'Open' ? 'bg-green-100 text-green-800' :
          status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      key: 'resourcesCount',
      label: 'Resources',
      render: (count: number, job: any) => (
        <button
          onClick={() => navigate(`/resources?client=${job.clientId}&job=${job.id}`)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <Users className="w-4 h-4 mr-1" />
          {count}
        </button>
      )
    },
    { key: 'deadline', label: 'Deadline' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, job: any) => (
        <div className="space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openEditJobDrawer(job)}
            icon={Edit}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  const openCreateJobDrawer = () => {
    openDrawer({
      title: 'Create New Job',
      content: <CreateJobForm />,
      onClose: () => {}
    });
  };

  const openEditJobDrawer = (job: any) => {
    openDrawer({
      title: `Edit Job - ${job.title}`,
      content: <EditJobForm job={job} />,
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
            Jobs {clientName && `for ${clientName}`}
          </h1>
          <p className="mt-2 text-gray-600">Manage job postings and requirements</p>
        </div>
        <Button
          onClick={openCreateJobDrawer}
          icon={Plus}
          iconPosition="left"
        >
          Create Job
        </Button>
      </div>

      <Table
        data={filteredJobs}
        columns={columns}
        emptyMessage="No jobs found. Create your first job posting to get started."
      />
    </div>
  );
};

const CreateJobForm: React.FC = () => {
  const { clients } = useSelector((state: RootState) => state.clients);
  const { roles } = useSelector((state: RootState) => state.roles);
  const { openDrawer } = useDrawer();

  const [formData, setFormData] = React.useState({
    title: '',
    clientId: '',
    roleId: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating job:', formData);
  };

  const openCreateClientDrawer = () => {
    openDrawer({
      title: 'Create New Client',
      content: <CreateClientForm onClientCreated={(client) => setFormData({...formData, clientId: client.id})} />,
      onClose: () => {}
    });
  };

  const openCreateRoleDrawer = () => {
    openDrawer({
      title: 'Create New Role',
      content: <CreateRoleForm onRoleCreated={(role) => setFormData({...formData, roleId: role.id})} />,
      onClose: () => {}
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client
        </label>
        <div className="flex space-x-2">
          <Dropdown
            options={clients}
            displayKey="company"
            value={formData.clientId}
            onChange={(value) => setFormData({...formData, clientId: (value as any)?.id || ''})}
            placeholder="Select Client"
            className="flex-1"
            required
          />
          <Button
            type="button"
            variant="secondary"
            onClick={openCreateClientDrawer}
            icon={Plus}
          >
            New Client
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <div className="flex space-x-2">
          <Dropdown
            options={roles}
            displayKey="name"
            value={formData.roleId}
            onChange={(value) => setFormData({...formData, roleId: (value as any)?.id || ''})}
            placeholder="Select Role"
            className="flex-1"
            required
          />
          <Button
            type="button"
            variant="secondary"
            onClick={openCreateRoleDrawer}
            icon={Plus}
          >
            New Role
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Create Job
        </Button>
      </div>
    </form>
  );
};

interface EditJobFormProps {
  job: any;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job }) => {
  const { clients } = useSelector((state: RootState) => state.clients);
  const { roles } = useSelector((state: RootState) => state.roles);

  const [formData, setFormData] = React.useState({
    title: job.title,
    clientId: job.clientId,
    roleId: job.roleId,
    description: job.description,
    deadline: job.deadline || '',
    status: job.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating job:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client
        </label>
        <Dropdown
          options={clients}
          displayKey="company"
          value={formData.clientId}
          onChange={(value) => setFormData({...formData, clientId: (value as any)?.id || ''})}
          placeholder="Select Client"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <Dropdown
          options={roles}
          displayKey="name"
          value={formData.roleId}
          onChange={(value) => setFormData({...formData, roleId: (value as any)?.id || ''})}
          placeholder="Select Role"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <Dropdown
          options={['Open', 'In Progress', 'Closed']}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as string })}
          placeholder="Select Status"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Update Job
        </Button>
      </div>
    </form>
  );
};

// Reuse components from Clients.tsx
const CreateClientForm: React.FC<{ onClientCreated: (client: any) => void }> = ({ onClientCreated }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      id: Date.now().toString(),
      ...formData,
      jobsCount: 0,
      resourcesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onClientCreated(newClient);
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
        <Dropdown
          options={['Technology', 'Consulting', 'Finance', 'Healthcare']}
          value={formData.industry}
          onChange={(value) => setFormData({ ...formData, industry: value as string })}
          placeholder="Select Industry"
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">Create Client</Button>
      </div>
    </form>
  );
};

const CreateRoleForm: React.FC<{ onRoleCreated: (role: any) => void }> = ({ onRoleCreated }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    department: '',
    level: '',
    skillsRequired: '',
    experienceMin: '',
    experienceMax: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: Date.now().toString(),
      ...formData,
      skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()),
      experienceMin: parseInt(formData.experienceMin),
      experienceMax: parseInt(formData.experienceMax),
      createdAt: new Date().toISOString().split('T')[0]
    };
    onRoleCreated(newRole);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
        <Dropdown
          options={['Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director']}
          value={formData.level}
          onChange={(value) => setFormData({ ...formData, level: value as string })}
          placeholder="Select Level"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required (comma-separated)</label>
        <input
          type="text"
          name="skillsRequired"
          value={formData.skillsRequired}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
          <input
            type="number"
            name="experienceMin"
            value={formData.experienceMin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (years)</label>
          <input
            type="number"
            name="experienceMax"
            value={formData.experienceMax}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">Create Role</Button>
      </div>
    </form>
  );
};

export default Jobs;