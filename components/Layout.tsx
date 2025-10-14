
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  PhoneIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface NavItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    isGuestOnly?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isGuestOnly = false }) => {
    const { isGuest } = useAuth();
    
    if (isGuest && !isGuestOnly && to !== '/chatbot' && to !== '/exercises' && to !== '/sos') {
        return (
             <div className="flex items-center p-3 text-gray-500 cursor-not-allowed rounded-lg">
                <Icon className="h-6 w-6 mr-3" />
                <span>{label}</span>
                <span className="text-xs ml-auto bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Login to use</span>
            </div>
        );
    }
    
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 hover:bg-primary/10 dark:hover:bg-primary/20 ${
                isActive ? 'bg-primary/20 text-primary dark:text-primary font-semibold' : ''
                }`
            }
        >
            <Icon className="h-6 w-6 mr-3" />
            <span>{label}</span>
        </NavLink>
    );
};


const Layout: React.FC = () => {
  const { user, logout, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-light dark:bg-dark text-neutral dark:text-light">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-neutral p-4 flex flex-col justify-between border-r border-gray-200 dark:border-gray-700">
        <div>
            <div className="flex items-center mb-8">
                <SparklesIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold ml-2 text-neutral dark:text-white">SereneMind</h1>
            </div>
            <nav className="space-y-2">
                <NavItem to="/chatbot" icon={ChatBubbleLeftRightIcon} label="Chatbot" isGuestOnly/>
                <NavItem to="/journal" icon={BookOpenIcon} label="Journal" />
                <NavItem to="/test" icon={ClipboardDocumentCheckIcon} label="Wellness Test" />
                <NavItem to="/exercises" icon={SparklesIcon} label="Exercises" isGuestOnly/>
                <NavItem to="/sos" icon={PhoneIcon} label="SOS Hotline" isGuestOnly/>
            </nav>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {!isGuest && (
                 <NavItem to="/profile" icon={UserCircleIcon} label={user?.name || 'Profile'} />
            )}
            <button
                onClick={handleLogout}
                className="flex items-center p-3 w-full text-left text-red-500 rounded-lg transition-colors duration-200 hover:bg-red-500/10"
            >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-3" />
                <span>{isGuest ? 'Exit Guest Mode' : 'Logout'}</span>
            </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
