import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addClient, setClients } from '../store/slices/clientsSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Dropdown from '../components/UI/Dropdown/Dropdown';
// removed unused RHF/Yup field imports after refactor
import ClientForm from '../components/new-forms/ClientForm';
import JobForm from '../components/new-forms/JobForm';
import { clientsApi } from '../services/api/clientsApi';
import { jobsApi } from '../services/api/jobsApi';
import { useApi } from '../hooks/useApi';
import { Plus } from 'lucide-react';
import Jobs from './Jobs';
import Resources from './Resources';
import ResourceDetails from './ResourceDetails';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';

const Clients: React.FC = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state: RootState) => state.clients);
  const { roles } = useSelector((state: RootState) => state.roles);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { openDrawer } = useDrawer();
  const getClients = useApi(clientsApi.getAll);
  const createClient = useApi(clientsApi.create);
  const createJob = useApi(jobsApi.create);

  const [viewLevel, setViewLevel] = React.useState<'clients' | 'jobs' | 'resources'>('clients');
  const [selectedClientId, setSelectedClientId] = React.useState<string | undefined>(undefined);
  const [selectedJobId, setSelectedJobId] = React.useState<string | undefined>(undefined);
  const [selectedClientName, setSelectedClientName] = React.useState<string | undefined>(undefined);
  const [selectedJobName, setSelectedJobName] = React.useState<string | undefined>(undefined);
  const [selectedResourceName, setSelectedResourceName] = React.useState<string | undefined>(undefined);
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      const res = await getClients.execute();
      // assuming envelope returns array directly as data
      dispatch(setClients(res));
    })();
  }, [dispatch]);

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
          onClick={() => {
            setSelectedClientId(client.id);
            setSelectedClientName(client.company || client.name);
            setSelectedJobId(undefined);
            setSelectedJobName(undefined);
            setSelectedResourceName(undefined);
            setViewLevel('jobs');
          }}
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
          onClick={() => {
            setSelectedClientId(client.id);
            setSelectedClientName(client.company || client.name);
            setSelectedJobId(undefined);
            setSelectedJobName(undefined);
            setSelectedResourceName(undefined);
            setViewLevel('resources');
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {count} resources
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, client: any) => (
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
      content: (
        <ClientForm
          mode="create"
          onSubmit={async (values) => {
            const res = await createClient.execute(values);
            const newClient = {
              id: res.id || Date.now().toString(),
              ...values,
              jobsCount: 0,
              resourcesCount: 0,
              createdAt: new Date().toISOString().split('T')[0],
            } as any;
            dispatch(addClient(newClient));
          }}
        />
      ),
      onClose: () => {}
    });
  };

  const openAddJobDrawer = (client: any) => {
    openDrawer({
      title: `Add Job for ${client.company}`,
      content: (
        <JobForm
          mode="create"
          defaultValues={{ clientId: client.id, title: '', roleId: '', description: '', deadline: '' }}
          clients={clients as any}
          roles={roles as any}
          onSubmit={async (values) => {
            await createJob.execute({ ...values, status: 'Open' });
          }}
          onCreateRole={(setRoleId) => {
            openDrawer({
              title: 'Create New Role',
              content: <CreateRoleForm onRoleCreated={(role) => setRoleId(role.id)} />,
              onClose: () => {}
            });
          }}
        />
      ),
      onClose: () => {}
    });
  };

  if (viewLevel === 'jobs' && selectedClientId) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb
            home={{ label: 'Home', onClick: () => {
              setViewLevel('clients');
              setSelectedClientId(undefined);
              setSelectedClientName(undefined);
              setSelectedJobId(undefined);
              setSelectedJobName(undefined);
              setSelectedResourceName(undefined);
            }}}
            items={[
              { label: selectedClientName || 'Client' },
              { label: 'Jobs' },
              ...(selectedResourceName ? [{ label: selectedResourceName }] : []),
            ]}
          />
        </div>
        <Jobs
          embedded={true}
          clientId={selectedClientId}
          breadcrumbItems={[
            { label: selectedClientName || 'Client', onClick: () => setViewLevel('clients') },
            { label: 'Jobs' },
          ]}
          onOpenResources={({ clientId, jobId }) => {
            setSelectedClientId(clientId);
            setSelectedJobId(jobId);
            const job = (jobs as any)?.find?.((j: any) => j.id === jobId);
            setSelectedJobName(job?.title);
            setSelectedResourceName(undefined);
            setViewLevel('resources');
          }}
        />
      </div>
    );
  }

  if (viewLevel === 'resources' && selectedClientId) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb
            home={{ label: 'Home', onClick: () => {
              setViewLevel('clients');
              setSelectedClientId(undefined);
              setSelectedClientName(undefined);
              setSelectedJobId(undefined);
              setSelectedJobName(undefined);
              setSelectedResourceName(undefined);
              setSelectedResourceId(undefined);
            }}}
            items={[
              { label: selectedClientName || 'Client', onClick: () => setViewLevel('jobs') },
              ...(selectedJobName ? [{ label: selectedJobName, onClick: () => setViewLevel('jobs') }] : []),
              { label: 'Resources', onClick: selectedResourceId ? () => { setSelectedResourceId(undefined); setSelectedResourceName(undefined); } : undefined },
              ...(selectedResourceName ? [{ label: selectedResourceName }] : []),
            ]}
          />
        </div>
        {selectedResourceId ? (
          <ResourceDetails
            embedded
            showBreadcrumb={false}
            resourceId={selectedResourceId}
          />
        ) : (
          <Resources
            embedded
            clientId={selectedClientId}
            jobId={selectedJobId}
            showBreadcrumb={false}
            breadcrumbItems={[
              { label: selectedClientName || 'Client', onClick: () => setViewLevel('jobs') },
              ...(selectedJobName ? [{ label: selectedJobName, onClick: () => setViewLevel('jobs') }] : []),
              { label: 'Resources' },
            ]}
            onOpenResourceDetails={(resource) => {
              setSelectedResourceName(resource?.name);
              setSelectedResourceId(resource?.id);
            }}
          />
        )}
      </div>
    );
  }

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

interface CreateRoleFormProps {
  onRoleCreated: (role: any) => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ onRoleCreated }) => {
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