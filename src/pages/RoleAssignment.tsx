import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { assignRole } from '../store/slices/usersSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import { UserPlus, Shield } from 'lucide-react';

const RoleAssignment: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.users);
  const { openDrawer } = useDrawer();
  
  const columns = [
    { key: 'name', label: 'Name', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { 
      key: 'role', 
      label: 'Role', 
      filterable: true,
      filterOptions: ['Admin', 'Job Manager', 'Recruiter'],
      render: (role: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          role === 'Admin' ? 'bg-red-100 text-red-800' :
          role === 'Job Manager' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {role}
        </span>
      )
    },
    { key: 'department', label: 'Department', filterable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user: any) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openAssignRoleDrawer(user)}
        >
          Edit Role
        </Button>
      )
    }
  ];

  const openAssignRoleDrawer = (user?: any) => {
    openDrawer({
      title: user ? `Edit Role - ${user.name}` : 'Assign Role',
      content: <AssignRoleForm user={user} />
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Assignment</h1>
          <p className="mt-2 text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button
          onClick={() => openAssignRoleDrawer()}
          icon={Shield}
          iconPosition="left"
        >
          Assign Role
        </Button>
      </div>

      <Table
        data={users}
        columns={columns}
        emptyMessage="No users found. Add users to assign roles."
      />
    </div>
  );
};

interface AssignRoleFormProps {
  user?: any;
}

const AssignRoleForm: React.FC<AssignRoleFormProps> = ({ user }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.users);
  const [selectedUserId, setSelectedUserId] = useState(user?.id || '');
  const [selectedRole, setSelectedRole] = useState(user?.role || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && selectedRole) {
      dispatch(assignRole({ 
        userId: selectedUserId, 
        role: selectedRole as 'Admin' | 'Job Manager' | 'Recruiter'
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select User
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          disabled={!!user}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          required
        >
          <option value="">Choose a user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a role</option>
          <option value="Admin">Admin</option>
          <option value="Job Manager">Job Manager</option>
          <option value="Recruiter">Recruiter</option>
        </select>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">Role Permissions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {selectedRole === 'Admin' && (
            <>
              <li>• Assign roles to other employees</li>
              <li>• Full access to all features</li>
              <li>• Manage users and system settings</li>
            </>
          )}
          {selectedRole === 'Job Manager' && (
            <>
              <li>• Manage clients and jobs</li>
              <li>• View and manage resources</li>
              <li>• Create and edit job postings</li>
            </>
          )}
          {selectedRole === 'Recruiter' && (
            <>
              <li>• Manage resources and candidates</li>
              <li>• Conduct interviews and evaluations</li>
              <li>• View assigned jobs and clients</li>
            </>
          )}
        </ul>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" variant="primary">
          {user ? 'Update Role' : 'Assign Role'}
        </Button>
      </div>
    </form>
  );
};

export default RoleAssignment;