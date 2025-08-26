import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../store';
import { 
  Users, 
  Building2, 
  Briefcase, 
  UserCheck, 
  Settings,
  LogOut,
  Shield
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      name: 'Role Assignment',
      path: '/role-assignment',
      icon: Shield,
      roles: ['Admin']
    },
    {
      name: 'Clients',
      path: '/clients',
      icon: Building2,
      roles: ['Admin', 'Job Manager', 'Recruiter']
    },
    {
      name: 'Jobs',
      path: '/jobs',
      icon: Briefcase,
      roles: ['Admin', 'Job Manager', 'Recruiter']
    },
    {
      name: 'Resources',
      path: '/resources',
      icon: UserCheck,
      roles: ['Admin', 'Job Manager', 'Recruiter']
    },
    {
      name: 'Users',
      path: '/users',
      icon: Users,
      roles: ['Admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">Staffing Tracker</h1>
        {user && (
          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center px-4 py-3 w-full text-slate-300 hover:bg-slate-800 rounded-lg transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <button className="flex items-center px-4 py-3 w-full text-slate-300 hover:bg-slate-800 rounded-lg transition-colors duration-200">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;