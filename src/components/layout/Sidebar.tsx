import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Mail, 
  FileText, 
  CreditCard, 
  LogOut
} from 'lucide-react';

interface SidebarProps {
  mobile: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3 flex-shrink-0 h-5 w-5">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ mobile }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    // Redirect to sign in page
    navigate('/signin');
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="flex flex-shrink-0 items-center px-4 h-16">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="ml-2 text-lg font-bold text-gray-900">ofmbase</span>
          <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          <div className="mb-4">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          </div>
          
          <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </div>
          <div className="space-y-1 mb-6">
            <NavItem to="/users" icon={<Users size={18} />} label="Users" />
            <NavItem to="/finance" icon={<DollarSign size={18} />} label="Finance" />
            <NavItem to="/messaging" icon={<Mail size={18} />} label="Emails" />
            <NavItem to="/documents" icon={<FileText size={18} />} label="Documents" />
            <NavItem to="/subscriptions" icon={<CreditCard size={18} />} label="Subscriptions" />
          </div>
        </nav>
      </div>
      
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 font-medium">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@ofmbase.com</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="mr-3 flex-shrink-0 h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;