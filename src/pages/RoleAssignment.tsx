import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { assignRole } from '../store/slices/usersSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Dropdown from '../components/UI/Dropdown/Dropdown';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectField from '../components/forms-fields/SelectField';
import { useApi } from '../hooks/useApi';
import { usersApi } from '../services/api/usersApi';
import { ROLE_DISPLAY_NAMES, Roles } from '../store/slices/employeeSlice';
import { UserPlus, Shield } from 'lucide-react';

const RoleAssignment: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.users);
  const { openDrawer } = useDrawer();
  
  const roleDisplayList = Object.values(ROLE_DISPLAY_NAMES);

  const columns = [
    { key: 'name', label: 'Name', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { 
      key: 'roles', 
      label: 'Roles', 
      filterable: true,
      filterOptions: roleDisplayList,
      render: (_: any, user: any) => {
        const rawRoles: string[] = Array.isArray(user?.roles)
          ? user.roles
          : user?.role
          ? [user.role]
          : [];
        const toDisplay = (r: string) => {
          // Support either backend constants (e.g., 'ADMIN') or human labels (e.g., 'Admin')
          const displayFromConstant = (ROLE_DISPLAY_NAMES as any)[r];
          if (displayFromConstant) return displayFromConstant;
          return r;
        };
        return (
          <div className="flex flex-wrap gap-2">
            {rawRoles.map((r: string) => (
              <span key={r} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {toDisplay(r)}
              </span>
            ))}
          </div>
        );
      }
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
      content: <AssignRoleForm user={user} />,
      onClose: () => {}
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
  const assignRoleApi = useApi(usersApi.assignRole);

  const schema = yup.object({
    userId: yup.string().required('User is required'),
    roles: yup.array(yup.string()).min(1, 'Select at least one role'),
  });

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      userId: user?.id || '',
      roles: Array.isArray(user?.roles)
        ? user.roles.map((r: string) => (ROLE_DISPLAY_NAMES as any)[r] || r)
        : user?.role
        ? [(ROLE_DISPLAY_NAMES as any)[user.role] || user.role]
        : [],
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: any) => {
    const selectedDisplays: string[] = values.roles || [];
    const displayToConstant = (display: string) => {
      const entry = Object.entries(ROLE_DISPLAY_NAMES).find(([, v]) => v === display);
      return (entry?.[0] as keyof typeof Roles) || display;
    };
    const roleConstants = selectedDisplays.map(displayToConstant);
    for (const roleConst of roleConstants) {
      await assignRoleApi.execute(values.userId, roleConst as string);
    }
  };

  const roleDisplayList = [
    { id: 'admin', name: 'Admin' },
    { id: 'job_manager', name: 'Job Manager' },
    { id: 'recruiter', name: 'Recruiter' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <SelectField control={control} name="userId" label="Select User" options={users as any} displayKey={'name' as any} valueKey={'id' as any} />
      <SelectField control={control} name="roles" label="Roles" options={roleDisplayList} displayKey={'name' as any} valueKey={'id' as any}  multiple={true} />

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">Role Permissions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Permissions vary by role.</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" variant="primary">{user ? 'Update Roles' : 'Assign Roles'}</Button>
      </div>
    </form>
  );
};

export default RoleAssignment;