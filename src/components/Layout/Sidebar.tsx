import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../store';
import {
    Building2,
    Briefcase,
    UserCheck,
    Settings,
    LogOut,
    Shield,
    Truck
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isHovered, setIsHovered] = React.useState(false);

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
            name: 'Requirements',
            path: '/jobs',
            icon: Briefcase,
            roles: ['Admin', 'Job Manager', 'Recruiter']
        },
        {
            name: 'Candidates',
            path: '/resources',
            icon: UserCheck,
            roles: ['Admin', 'Job Manager', 'Recruiter']
        }
    ];

    const filteredMenuItems = menuItems.filter(
        (item) => user && item.roles.includes(user.role)
    );

    // Abbreviation for collapsed mode
    const getAbbreviation = (fullName: string) => {
        const parts = fullName.split(' ');
        return parts.slice(0, 2).map(p => p.slice(0, 1).toUpperCase()).join('');
    };

    return (
        <div
            className={`bg-[#394253] text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isHovered ? 'w-64' : 'w-16'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="px-2 py-4">
                {/* User Info */}
                {user && (
                    <div className="mt-2">
                        {isHovered ? (
                            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-white/70 truncate">{user.role}</p>
                            </div>
                        ) : (
                            // collapsed -> styled like a nav item
                            <div
                                className="flex items-center justify-center w-full px-3 py-3 rounded-lg 
                   text-white/100 bg-transparent"
                            >
                                <span className="font-bold text-lg uppercase">
                                    {getAbbreviation(user.name)}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2">
                <ul className="space-y-2">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-white text-[#394253]'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                    title={!isHovered ? item.name : ''}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {isHovered && (
                                        <span className="ml-3">{item.name}</span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
