import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
import ResourceDetails from './ResourceDetails';
// removed page-embedded field components after refactor
import { useApi } from '../hooks/useApi';
import { resourcesApi } from '../services/api/resourcesApi';
import { setResources } from '../store/slices/resourcesSlice';
import { Plus, Edit, Eye } from 'lucide-react';
import ResourceCreateForm from '../components/new-forms/ResourceCreateForm';
import ResourceEditForm from '../components/new-forms/ResourceEditForm';
import VendorCreateForm from '../components/new-forms/VendorCreateForm';

interface ResourcesProps {
  embedded?: boolean;
  clientId?: string;
  jobId?: string;
  breadcrumbItems?: { label: string; onClick?: () => void }[];
  onOpenResourceDetails?: (resource: any) => void;
  showBreadcrumb?: boolean;
}

const Resources: React.FC<ResourcesProps> = ({ embedded = false, clientId, jobId, breadcrumbItems, onOpenResourceDetails, showBreadcrumb = true }) => {
  // navigate no longer used after inline views
  const [searchParams] = useSearchParams();
  const clientFilter = embedded ? clientId || null : searchParams.get('client');
  const jobFilter = embedded ? jobId || null : searchParams.get('job');
  
  const dispatch = useDispatch();
  const { resources } = useSelector((state: RootState) => state.resources);
  const { clients } = useSelector((state: RootState) => state.clients);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { openDrawer } = useDrawer();
  const getResources = useApi(resourcesApi.getAll);
  const createResource = useApi(resourcesApi.create);
  const updateResource = useApi(resourcesApi.update);
  const [inlineView, setInlineView] = React.useState<'list'|'details'>(embedded ? 'list' : 'list');
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | undefined>(undefined);
  const [selectedResourceName, setSelectedResourceName] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      const res = await getResources.execute();
      dispatch(setResources(res));
    })();
  }, [dispatch]);

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

  const internalBreadcrumb = breadcrumbItems ?? (
    inlineView === 'details' && !embedded
      ? [
          { label: 'Resources', onClick: () => { setInlineView('list'); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } },
          ...(clientName ? [{ label: clientName }] as { label: string; onClick?: () => void }[] : []),
          ...(jobName ? [{ label: jobName }] as { label: string; onClick?: () => void }[] : []),
          ...(selectedResourceName ? [{ label: selectedResourceName }] as { label: string; onClick?: () => void }[] : [])
        ]
      : []
  );

  const columns = [
    { 
      key: 'name', 
      label: 'Candidate Name', 
      filterable: true,
      render: (name: string, resource: any) => (
        <button
          onClick={() => {
            if (embedded && onOpenResourceDetails) {
              onOpenResourceDetails(resource);
            } else {
              setInlineView('details');
              setSelectedResourceId(resource.id);
              setSelectedResourceName(resource.name);
            }
          }}
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
      render: (_: unknown, resource: any) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (embedded && onOpenResourceDetails) {
                onOpenResourceDetails(resource);
              } else {
                setInlineView('details');
                setSelectedResourceId(resource.id);
                setSelectedResourceName(resource.name);
              }
            }}
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
      content: (
        <ResourceCreateForm
          onCreateJob={(setJobId) => {
            openDrawer({
              title: 'Create New Job',
              content: <CreateJobForm onJobCreated={(job) => setJobId(job.id)} />,
              onClose: () => {}
            });
          }}
          onCreateVendor={(setVendorId) => {
            openDrawer({
              title: 'Create New Vendor',
              content: <VendorCreateForm onVendorCreated={(vendor) => setVendorId(vendor.id)} />,
              onClose: () => {}
            });
          }}
          onSubmit={async (values) => {
            const payload = { ...values };
            await createResource.execute(payload);
          }}
        />
      ),
      onClose: () => {}
    });
  };

  const openEditResourceDrawer = (resource: any) => {
    openDrawer({
      title: `Edit Resource - ${resource.name}`,
      content: (
        <ResourceEditForm
          resource={resource}
          onSubmit={async (values) => {
            await updateResource.execute(resource.id, values);
          }}
        />
      ),
      onClose: () => {}
    });
  };

  if (!embedded && inlineView === 'details' && selectedResourceId) {
    return (
      <div className="p-6">
        {showBreadcrumb && (
          <div className="mb-4">
            <Breadcrumb
              home={{ label: 'Home', onClick: () => { setInlineView('list'); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } }}
              items={internalBreadcrumb}
            />
          </div>
        )}
        <ResourceDetails embedded resourceId={selectedResourceId} showBreadcrumb={false} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {showBreadcrumb && internalBreadcrumb.length > 0 && (
        <div className="mb-4">
          <Breadcrumb
            home={!embedded ? { label: 'Home', onClick: () => { setInlineView('list'); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } } : undefined}
            items={internalBreadcrumb}
          />
        </div>
      )}

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

// moved CreateResourceForm into new-forms

// Create Vendor Form Component
// moved CreateVendorForm into new-forms
// moved EditResourceForm into new-forms

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