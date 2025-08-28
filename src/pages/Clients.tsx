import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { addClient } from '../store/slices/clientsSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Dropdown from '../components/UI/Dropdown/Dropdown';
import { Building2, Plus, Briefcase, Users } from 'lucide-react';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { clients } = useSelector((state: RootState) => state.clients);
  const { openDrawer } = useDrawer();

  const columns = [
    { key: 'name', label: 'Client Name', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'company', label: 'Company', filterable: true },
    { key: 'industry', label: 'Industry', filterable: true, filterOptions: ['Technology', 'Consulting', 'Finance', 'Healthcare'] },
    {
      key: 'jobsCount',
      label: 'Jobs',
      render: (count: number, client: any) => (
        <button
          onClick={() => navigate(`/jobs?client=${client.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {count} jobs
        </button>
      )
    },
    {
      key: 'resourcesCount',
      label: 'Resources',
      render: (count: number, client: any) => (
        <button
          onClick={() => navigate(`/resources?client=${client.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {count} resources
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, client: any) => (
        <div className="space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => openAddJobDrawer(client)}
            icon={Plus}
          >
            Add Job
          </Button>
        </div>
      )
    }
  ];

  const openCreateClientDrawer = () => {
    openDrawer({
      title: 'Create New Client',
      content: <CreateClientForm />,
      onClose: () => {}
    });
  };

  const openAddJobDrawer = (client: any) => {
    openDrawer({
      title: `Add Job for ${client.company}`,
      content: <AddJobForm client={client} />,
      onClose: () => {}
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-2 text-gray-600">Manage your client relationships</p>
        </div>
        <Button
          onClick={openCreateClientDrawer}
          icon={Plus}
          iconPosition="left"
        >
          Add Client
        </Button>
      </div>

      <Table
        data={clients}
        columns={columns}
        emptyMessage="No clients found. Create your first client to get started."
      />
    </div>
  );
};

const CreateClientForm: React.FC = () => {
  const dispatch = useDispatch();
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
    dispatch(addClient(newClient));
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
          Company
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <Dropdown
          options={['Technology', 'Consulting', 'Finance', 'Healthcare']}
          value={formData.industry}
          onChange={(value) => setFormData({ ...formData, industry: value as string })}
          placeholder="Select Industry"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Create Client
        </Button>
      </div>
    </form>
  );
};

interface AddJobFormProps {
  client: any;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ client }) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state: RootState) => state.roles);
  const { openDrawer } = useDrawer();

  const [formData, setFormData] = React.useState({
    title: '',
    roleId: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRole = roles.find(r => r.id === formData.roleId);
    // Would normally dispatch addJob action here
    console.log('Adding job:', { ...formData, client, role: selectedRole });
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
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-900">Client: {client.company}</h4>
        <p className="text-sm text-gray-600">{client.name} • {client.email}</p>
      </div>

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

interface CreateRoleFormProps {
  onRoleCreated: (role: any) => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ onRoleCreated }) => {
  const dispatch = useDispatch();
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
    // dispatch(addRole(newRole));
    onRoleCreated(newRole);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role Name
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
          Department
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level
        </label>
        <Dropdown
          options={['Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director']}
          value={formData.level}
          onChange={(value) => setFormData({ ...formData, level: value as string })}
          placeholder="Select Level"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills Required (comma-separated)
        </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Experience (years)
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Experience (years)
          </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Create Role
        </Button>
      </div>
    </form>
  );
};

export default Clients;