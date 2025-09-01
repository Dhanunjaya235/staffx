import React from 'react';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  home?: { label?: string; onClick: () => void };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, home }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {home && (
          <li className="flex items-center">
            <button
              type="button"
              onClick={home.onClick}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              {home.label ?? 'Home'}
            </button>
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {(index > 0 || home) && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </button>
            ) : item.path ? (
              // Keep path support if needed elsewhere
              <a
                href={item.path}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;