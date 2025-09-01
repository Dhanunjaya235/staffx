import React from 'react';
import { useSelector , useDispatch} from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
import Resources from './Resources';
import ResourceDetails from './ResourceDetails';
// removed page-embedded dropdown usage after refactor
// removed unused RHF/Yup field imports after refactor
import ClientForm from '../components/new-forms/ClientForm';
import JobForm from '../components/new-forms/JobForm';
import RoleCreateForm from '../components/new-forms/RoleCreateForm';
import { useApi } from '../hooks/useApi';
import { jobsApi } from '../services/api/jobsApi';
import { clientsApi } from '../services/api/clientsApi';
import { setJobs } from '../store/slices/jobsSlice';
import { Plus, Edit, Users } from 'lucide-react';

interface JobsProps {
  embedded?: boolean;
  clientId?: string;
  breadcrumbItems?: { label: string; onClick?: () => void }[];
  onOpenResources?: (args: { clientId?: string; jobId?: string }) => void;
  showBreadcrumb?: boolean;
}

const Jobs: React.FC<JobsProps> = ({ embedded = false, clientId, onOpenResources, showBreadcrumb = true }) => {
  // navigate not required in current inline flow
  const [searchParams] = useSearchParams();
  const clientFilter = embedded ? clientId || null : searchParams.get('client');
  
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { clients } = useSelector((state: RootState) => state.clients);
  const { roles } = useSelector((state: RootState) => state.roles);
  const { openDrawer } = useDrawer();
  const [inlineView, setInlineView] = React.useState<'jobs'|'resources'|'resourceDetails'>('jobs');
  const [selectedJobId, setSelectedJobId] = React.useState<string | undefined>(undefined);
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | undefined>(undefined);
  // keep for future breadcrumb expansion if needed
  // const [selectedJobName, setSelectedJobName] = React.useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const getJobs = useApi(jobsApi.getAll);
  const createJob = useApi(jobsApi.create);
  const updateJob = useApi(jobsApi.update);
  const createClient = useApi(clientsApi.create);

  React.useEffect(() => {
    (async () => {
      const res = await getJobs.execute();
      dispatch(setJobs(res));
    })();
  }, [dispatch]);

  const filteredJobs = clientFilter 
    ? jobs.filter(job => job.clientId === clientFilter)
    : jobs;

  const clientName = clientFilter 
    ? clients.find(c => c.id === clientFilter)?.company 
    : null;

  // breadcrumb suppressed for jobs list base

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
          onClick={() => {
            if (embedded && onOpenResources) {
              onOpenResources({ clientId: job.clientId, jobId: job.id });
            } else {
              setInlineView('resources');
              setSelectedJobId(job.id);
              // inline view: we stay on Jobs screen
            }
          }}
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
      render: (_: unknown, job: any) => (
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
      content: (
        <JobForm
          mode="create"
          clients={clients as any}
          roles={roles as any}
          onSubmit={async (values) => {
            await createJob.execute({ ...values, status: 'Open' });
          }}
          onCreateClient={(setClientId) => {
            openDrawer({
              title: 'Create New Client',
              content: (
                <ClientForm
                  mode="create"
                  onSubmit={async (clientValues) => {
                    const res = await createClient.execute(clientValues);
                    const newClientId = (res as any)?.id || Date.now().toString();
                    setClientId(newClientId);
                  }}
                />
              ),
              onClose: () => {}
            });
          }}
          onCreateRole={(setRoleId) => {
            openDrawer({
              title: 'Create New Role',
              content: <RoleCreateForm onRoleCreated={(role) => setRoleId(role.id)} />,
              onClose: () => {}
            });
          }}
        />
      ),
      onClose: () => {}
    });
  };

  const openEditJobDrawer = (job: any) => {
    openDrawer({
      title: `Edit Job - ${job.title}`,
      content: (
        <JobForm
          mode="edit"
          defaultValues={{
            title: job.title,
            clientId: job.clientId,
            roleId: job.roleId,
            description: job.description,
            deadline: job.deadline || '',
            status: job.status,
          }}
          clients={clients as any}
          roles={roles as any}
          includeStatus
          onSubmit={async (values) => {
            await updateJob.execute(job.id, values);
          }}
        />
      ),
      onClose: () => {}
    });
  };

  if (!embedded && inlineView === 'resourceDetails' && selectedResourceId) {
    return (
      <div className="p-6">
        {showBreadcrumb && (
          <div className="mb-4">
            <Breadcrumb
              home={{ label: 'Home', onClick: () => { setInlineView('jobs'); setSelectedJobId(undefined); setSelectedResourceId(undefined); } }}
              items={[
                ...(clientName ? [{ label: clientName, onClick: () => setInlineView('jobs') }] : []),
                { label: 'Jobs', onClick: () => setInlineView('jobs') },
                { label: 'Resources', onClick: () => setInlineView('resources') },
              ]}
            />
          </div>
        )}
        <ResourceDetails embedded resourceId={selectedResourceId} showBreadcrumb={false} />
      </div>
    );
  }

  if (!embedded && inlineView === 'resources' && selectedJobId) {
    return (
      <div className="p-6">
        {showBreadcrumb && (
          <div className="mb-4">
            <Breadcrumb
              home={{ label: 'Home', onClick: () => { setInlineView('jobs'); setSelectedJobId(undefined); setSelectedResourceId(undefined); } }}
              items={[
                ...(clientName ? [{ label: clientName, onClick: () => setInlineView('jobs') }] : []),
                { label: 'Jobs', onClick: () => setInlineView('jobs') },
                { label: 'Resources' },
              ]}
            />
          </div>
        )}
        <Resources
          embedded
          clientId={clientFilter || undefined}
          jobId={selectedJobId}
          showBreadcrumb={false}
          breadcrumbItems={[
            ...(clientName ? [{ label: clientName, onClick: () => setInlineView('jobs') }] : []),
            { label: 'Jobs', onClick: () => setInlineView('jobs') },
            { label: 'Resources' },
          ]}
          onOpenResourceDetails={(resource) => {
            setSelectedResourceId(resource?.id);
            setInlineView('resourceDetails');
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* No breadcrumb for base Jobs list */}

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

// moved CreateRoleForm into new-forms

export default Jobs;