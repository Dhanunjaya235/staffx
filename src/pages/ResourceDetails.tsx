import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
// import Dropdown from '../components/UI/Dropdown/Dropdown';
import RoundCreateForm from '../components/new-forms/RoundCreateForm';
import RoundEditForm from '../components/new-forms/RoundEditForm';
// import { setRounds } from '../store/slices/resourcesSlice';
import { ArrowLeft, Plus, Edit, Phone, Mail, Calendar, User, ChevronDown, ChevronRight } from 'lucide-react';

interface ResourceDetailsProps {
  embedded?: boolean;
  resourceId?: string;
  breadcrumbItems?: { label: string; onClick?: () => void }[];
  showBreadcrumb?: boolean;
}

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ embedded = false, resourceId, breadcrumbItems, showBreadcrumb = true }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { resources, rounds } = useSelector((state: RootState) => state.resources);
  const { openDrawer } = useDrawer();
  const [expandedRounds, setExpandedRounds] = useState<string[]>([]);

  const resource = resources.find(r => r.id === (embedded ? resourceId : id));
  const resourceRounds = rounds.filter(r => r.resourceId === id);

  // Ideally fetch rounds by resource
  // Skipped API fetch here if rounds already in store

  if (!resource) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <Button onClick={() => navigate('/resources')}>
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  const internalBreadcrumb = breadcrumbItems ?? [
    { label: 'Resources', path: '/resources' },
    { label: resource.name }
  ];

  const toggleRound = (roundId: string) => {
    setExpandedRounds(prev => 
      prev.includes(roundId) 
        ? prev.filter(id => id !== roundId)
        : [...prev, roundId]
    );
  };

  const openAddRoundDrawer = () => {
    openDrawer({
      title: `Add Interview Round - ${resource.name}`,
      content: <RoundCreateForm resource={resource} />,
      onClose: () => {}
    });
  };

  const openEditRoundDrawer = (round: any) => {
    openDrawer({
      title: `Edit Round ${round.roundNumber} - ${round.roundType}`,
      content: <RoundEditForm round={round} />,
      onClose: () => {}
    });
  };

  return (
    <div className="p-6">
      {showBreadcrumb && (
        <div className="mb-4">
          <Breadcrumb items={internalBreadcrumb} />
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {!embedded && (
            <Button
              variant="secondary"
              onClick={() => navigate('/resources')}
              icon={ArrowLeft}
              className="mr-4"
            >
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{resource.name}</h1>
            <p className="text-gray-600">Resource Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={openAddRoundDrawer}
            icon={Plus}
          >
            Add Round
          </Button>
          <Button
            variant="secondary"
            onClick={() => {}}
            icon={Edit}
          >
            Edit Resource
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{resource.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{resource.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Assignment</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium text-lg">{resource.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium">{resource.clientName}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-600">Resource Type</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    resource.resourceType === 'Self' ? 'bg-blue-100 text-blue-800' :
                    resource.resourceType === 'Freelancer' ? 'bg-green-100 text-green-800' :
                    resource.resourceType === 'Vendor' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.resourceType}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium">{resource.experience} years</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {resource.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  resource.interviewStatus === 'Passed' ? 'bg-green-100 text-green-800' :
                  resource.interviewStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                  resource.interviewStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  resource.interviewStatus === 'On Hold' ? 'bg-gray-100 text-gray-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {resource.interviewStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rounds</p>
                <p className="font-bold text-2xl text-blue-600">{resource.roundsCount}</p>
              </div>
              {resource.currentRound && (
                <div>
                  <p className="text-sm text-gray-600">Current Round</p>
                  <p className="font-bold text-lg">{resource.currentRound}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Rounds */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Interview Rounds</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {resourceRounds.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No interview rounds scheduled yet.</p>
              <Button
                onClick={openAddRoundDrawer}
                className="mt-4"
                icon={Plus}
              >
                Schedule First Round
              </Button>
            </div>
          ) : (
            resourceRounds.map((round) => (
              <div key={round.id} className="p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleRound(round.id)}
                    className="flex items-center space-x-3 flex-1 text-left"
                  >
                    {expandedRounds.includes(round.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-medium text-gray-900">
                          Round {round.roundNumber}: {round.roundType}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          round.status === 'Passed' ? 'bg-green-100 text-green-800' :
                          round.status === 'Failed' ? 'bg-red-100 text-red-800' :
                          round.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          round.status === 'No Show' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {round.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {round.interviewer}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {round.date}
                        </span>
                      </div>
                    </div>
                  </button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditRoundDrawer(round)}
                    icon={Edit}
                  >
                    Edit
                  </Button>
                </div>

                {expandedRounds.includes(round.id) && (
                  <div className="mt-4 pl-8">
                    {round.feedback && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                          {round.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// moved Add/Edit round forms into new-forms

export default ResourceDetails;