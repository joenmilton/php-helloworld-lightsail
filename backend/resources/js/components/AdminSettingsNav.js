import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAnyPathActive } from '../utils/navHelpers';
import { useHasPermission } from '../utils/permissions';

function AdminSettingsNav({currentPath}) {
    const [activeTab, setActiveTab] = useState('general');

    const hasUpdateSettings = useHasPermission(["update settings"]);
    const hasUpdateDealSettings = useHasPermission(["update deal settings"]);
    const hasUpdateUserSettings = useHasPermission(["update user settings"]);
    const hasUpdateRoleSettings = useHasPermission(["update role settings"]);
    const hasUpdateTeamSettings = useHasPermission(["update team settings"]);
    const hasUpdateBankSettings = useHasPermission(["update bank settings"]);

    // Update active tab based on current path
    useEffect(() => {
        const path = currentPath.split('/').pop();
        if (path) {
            setActiveTab(path);
        }
    }, [currentPath]);

    const NavLink = ({ to, children, isActive }) => (
        <Link to={`/admin/settings/${to}`} 
            className={
                `settings-nav d-flex justify-content-between align-items-center fw-medium color-light ${
                    isAnyPathActive(location, [`/admin/settings/${to}`]) ? 'active' : ''
                }`
            }
        >
            {children}
        </Link>
    );

  return (
    <nav className="sticky-nav">
      <div className="custom-accordion">
        {hasUpdateSettings && (
        <NavLink
            to="general"
            isActive={activeTab === 'general'}
          >
            <div>
                <i className="bx bx-cog nav-icon me-2"></i>
                General
            </div>
        </NavLink>
        )}
        {hasUpdateDealSettings && (
        <NavLink
            to="deals"
            isActive={activeTab === 'deals'}
          >
            <div>
                <i className="fas fa-ticket-alt nav-icon nav-icon me-2"></i>
                Deals
            </div>
        </NavLink>
        )}
        {hasUpdateUserSettings && (
        <NavLink
            to="users"
            isActive={activeTab === 'users'}
          >
            <div>
                <i className="uil-users-alt nav-icon nav-icon me-2"></i>
                Users
            </div>
        </NavLink>
        )}
        {!hasUpdateUserSettings && hasUpdateRoleSettings && (
        <NavLink
            to="users/roles"
            isActive={activeTab === 'roles'}
        >
            <div>
                <i className="uil-shield-check nav-icon nav-icon me-2"></i>
                Roles
            </div>
        </NavLink>
        )}
        {!hasUpdateUserSettings && !hasUpdateRoleSettings && hasUpdateTeamSettings && (
        <NavLink
            to="users/teams"
            isActive={activeTab === 'teams'}
        >
            <div>
                <i className="uil-users-alt nav-icon nav-icon me-2"></i>
                Teams
            </div>
        </NavLink>
        )}
        {hasUpdateBankSettings && (
        <NavLink
            to="banks"
            isActive={activeTab === 'banks'}
          >
            <div>
                <i className="bx bxs-bank nav-icon nav-icon me-2"></i>
                Bank Accounts
            </div>
        </NavLink>
        )}
      </div>
    </nav>
  );
}

export default AdminSettingsNav;