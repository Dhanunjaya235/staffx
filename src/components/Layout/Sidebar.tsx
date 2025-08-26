import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { 
  Users, 
  Building2, 
  Briefcase, 
  UserCheck, 
  Settings,
  LogOut,
  Shield,
  Truck,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

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
      name: 'Vendors',
      path: '/vendors',
      icon: Truck,
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
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div 
      className={`bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out group hover:w-64 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
      onMouseEnter={() => !sidebarCollapsed && dispatch(toggleSidebar())}
      onMouseLeave={() => sidebarCollapsed && dispatch(toggleSidebar())}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-lg transition-opacity duration-300 ${
            sidebarCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}>
            Staffing Tracker
          </h1>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
        {user && (
          <div className={`mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg transition-opacity duration-300 ${
            sidebarCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}>
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-white/70 truncate">{user.role}</p>
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
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group/item ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className={`transition-opacity duration-300 ${
                    sidebarCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                  }`}>
                    {item.name}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20">
        <button className={`flex items-center px-4 py-3 w-full text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 hover:transform hover:scale-105 ${
          sidebarCollapsed ? 'justify-center' : ''
        }`}>
          <Settings className="w-5 h-5 mr-3" />
          <span className={`transition-opacity duration-300 ${
            sidebarCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}>
            Settings
          </span>
        </button>
        <button className={`flex items-center px-4 py-3 w-full text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 hover:transform hover:scale-105 mt-2 ${
          sidebarCollapsed ? 'justify-center' : ''
        }`}>
          <LogOut className="w-5 h-5 mr-3" />
          <span className={`transition-opacity duration-300 ${
            sidebarCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;