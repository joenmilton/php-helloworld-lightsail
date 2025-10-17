import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHasPermission } from '../utils/permissions';

function AdminSettingsUsersNav() {
    const location = useLocation();
    const hasUpdateUserSettings = useHasPermission(["update user settings"]);
    const hasUpdateRoleSettings = useHasPermission(["update role settings"]);
    const hasUpdateTeamSettings = useHasPermission(["update team settings"]);
    const activeTab = hasUpdateUserSettings ? 'users' : hasUpdateRoleSettings ? 'roles' : hasUpdateTeamSettings ? 'teams' : '';

    const getActiveClass = (path) => {
      return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="settings-top-nav">
            <ul className="nav nav-tabs nav-tabs-custom">
                <li className="nav-item">
                    {hasUpdateUserSettings && (
                    <NavLink
                        to="/admin/settings/users"
                        className="nav-link"
                        exact 
                        activeClassName={`${activeTab === 'users' ? 'active' : ''}`}
                        >
                        <span>
                            <i className="uil-user nav-icon nav-icon me-2"></i>
                            Users
                        </span>
                    </NavLink>
                    )}
                </li>
                <li className="nav-item">
                    {hasUpdateRoleSettings && (
                    <NavLink
                        to="/admin/settings/users/roles"
                        className="nav-link"
                        exact 
                        activeClassName={`${activeTab === 'roles' ? 'active' : ''}`}
                        >
                        <span>
                            <i className="uil-shield-check nav-icon nav-icon me-2"></i>
                            Roles
                        </span>
                    </NavLink>
                    )}
                </li>
                <li className="nav-item">
                    {hasUpdateTeamSettings && (
                    <NavLink
                        to="/admin/settings/users/teams"
                        className="nav-link"
                        exact 
                        activeClassName={`${activeTab === 'teams' ? 'active' : ''}`}
                        >
                        <span>
                            <i className="uil-users-alt nav-icon nav-icon me-2"></i>
                            Teams
                        </span>
                    </NavLink>
                    )}
                </li>
            </ul>
        </div>
    );
}

export default AdminSettingsUsersNav;