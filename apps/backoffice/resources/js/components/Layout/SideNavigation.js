import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'; // Import withRouter for version 5.3.4
import { isAnyPathActive } from '../../utils/navHelpers';
import { useHasPermission } from '../../utils/permissions';

const SideNavigation = ({ toggleSidebar, location }) => {
    // State to track which menu items are expanded
    const [expandedMenus, setExpandedMenus] = useState({});

    // Move all useHasPermission calls to the top to ensure consistent hook order
    const hasViewOwnDeals = useHasPermission(["view own deals"]);
    const hasViewDeals = useHasPermission(["view all deals", "view team deals", "view own deals"]);
    const hasViewActivities = useHasPermission(["view all activities", "view own activities", "view deal activities"]);
    const hasViewPayments = useHasPermission(["view payments"]);
    const hasViewProducts = useHasPermission(["view products"]);
    const hasViewPublicationSheet = useHasPermission(["view publication sheet"]);
    const hasViewReports = useHasPermission(["deal status report", "deal stage report"]);
    const hasDealStatusReport = useHasPermission(["deal status report"]);
    const hasUpdateSettings = useHasPermission(["update settings", "update deal settings", "update user settings", "update role settings", "update team settings", "update bank settings"]);

    // Function to handle menu toggle
    const handleMenuToggle = (menuKey) => {
        setExpandedMenus(prev => {
            const newState = {};
            // Set all menus to false first
            Object.keys(prev).forEach(key => {
                newState[key] = false;
            });
            // Then toggle the clicked menu
            newState[menuKey] = !prev[menuKey];
            return newState;
        });
    };

    // Function to get menu classes
    const getMenuClasses = (menuKey) => {
        const isExpanded = expandedMenus[menuKey];
        return {
            liClass: isExpanded ? "mm-active" : "",
            aClass: isExpanded ? "has-arrow mm-collapsed" : "has-arrow",
            ulClass: isExpanded ? "sub-menu mm-collapse mm-show" : "sub-menu mm-collapse"
        };
    };

    return (
        <div className="vertical-menu">
            <div className="navbar-brand-box">
                <a href="/" className="logo logo-dark">
                    <span className="logo-sm">
                        <img src="/assets/images/logo-sm.svg" alt="" height="26" />
                    </span>
                    <span className="logo-lg">
                        <img src="/assets/images/logo-sm.svg" alt="" height="26" />
                    </span>
                </a>
                <a href="/" className="logo logo-light">
                    <span className="logo-sm">
                        <img src="/assets/images/logo-sm.svg" alt="" height="26" />
                    </span>
                    <span className="logo-lg">
                        <img src="/assets/images/logo-sm.svg" alt="" height="26" />
                    </span>
                </a>
            </div>

            <button type="button" className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn" onClick={toggleSidebar}>
                <i className="fa fa-fw fa-bars"></i>
            </button>

            <div data-simplebar className="sidebar-menu-scroll">

                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title" data-key="t-menu">Menu</li>
                        {
                            hasViewOwnDeals ? 
                            <li className={`${isAnyPathActive(location, ['/admin/home']) ? "mm-active" : ""} ${getMenuClasses('dashboard').liClass}`}>
                                <Link to={`/admin/home`} 
                                    onClick={() => handleMenuToggle('dashboard')}
                                    className={`${
                                        isAnyPathActive(location, ['/admin/home']) ? "active" : ""
                                    }`}
                                >
                                    <i className="fas fa-home nav-icon"></i>
                                    <span className="menu-item">Dashboard</span>
                                </Link>
                            </li> : null
                        }
                        {
                            hasViewDeals ? 
                            <li className={`${isAnyPathActive(location, ['/admin/deals']) ? "mm-active" : ""} ${getMenuClasses('deals').liClass}`}>
                                <Link to={`/admin/deals`} 
                                    onClick={() => handleMenuToggle('deals')}
                                    className={`${
                                        isAnyPathActive(location, ['/admin/deals']) ? "active" : ""
                                    }`}
                                >
                                    <i className="fas fa-ticket-alt nav-icon"></i>
                                    <span className="menu-item">Deals</span>
                                </Link>
                            </li> : null
                        }
                        {
                            hasViewActivities ? 
                            <li className={`${isAnyPathActive(location, ['/admin/activity']) ? "mm-active" : ""} ${getMenuClasses('activities').liClass}`}>
                                <Link to={`/admin/activity`} 
                                    onClick={() => handleMenuToggle('activities')} 
                                    className={`${
                                        isAnyPathActive(location, ['/admin/activity']) ? "active" : ""
                                    }`}
                                >
                                    <i className="uil-calender nav-icon"></i>
                                    <span className="menu-item">Activities</span>
                                </Link>
                            </li> : null
                        }
                        {
                            hasViewPayments ? 
                            <li className={`${isAnyPathActive(location, ['/admin/payments']) ? "mm-active" : ""} ${getMenuClasses('payments').liClass}`}>
                                <Link to={`/admin/payments`}
                                    onClick={() => handleMenuToggle('payments')} 
                                    className={`${
                                        isAnyPathActive(location, ['/admin/payments']) ? "active" : ""
                                    }`}
                                >
                                    <i className="bx bx-money nav-icon"></i>
                                    <span className="menu-item">Payments</span>
                                </Link>
                            </li> : null
                        }
                        {
                            hasViewProducts ? 
                            <li className={`${isAnyPathActive(location, ['/admin/products']) ? "mm-active" : ""} ${getMenuClasses('services').liClass}`}>
                                <Link to={`/admin/products`} 
                                    onClick={() => handleMenuToggle('services')}
                                    className={`${
                                        isAnyPathActive(location, ['/admin/products']) ? "active" : ""
                                    }`}
                                >
                                    <i className="uil-postcard nav-icon"></i>
                                    <span className="menu-item">Services</span>
                                </Link>
                            </li> : null
                        }
                        {
                            hasViewPublicationSheet ? 
                            <li className={`${isAnyPathActive(location, ['/admin/sheet/process']) ? "mm-active" : ""} ${getMenuClasses('journal_sheet').liClass}`}>
                                <Link to={`/admin/sheet/process`} 
                                    className={`${
                                        isAnyPathActive(location, ['/admin/sheet/process']) ? "active" : ""
                                    }`}
                                    onClick={() => handleMenuToggle('journal_sheet')}
                                >
                                    <i className="uil-table nav-icon"></i>
                                    <span className="menu-item">Publication Sheet</span>
                                </Link>
                            </li> : null
                        }
                        {
                            hasViewReports ? 
                            <li className={`${isAnyPathActive(location, ['/admin/report/detailed-report/deal-status-report']) ? "mm-active" : ""} ${getMenuClasses('reports').liClass}`}>
                                <a href="#" 
                                   className={getMenuClasses('reports').aClass}
                                   aria-expanded={expandedMenus['reports'] ? "true" : "false"}
                                   onClick={() => handleMenuToggle('reports')}
                                >
                                    <i className="uil-file-alt nav-icon"></i>
                                    <span className="menu-item" data-key="t-multi-level">Reports</span>
                                </a>
                                <ul className={getMenuClasses('reports').ulClass} aria-expanded={expandedMenus['reports'] ? "true" : "false"}>
                                    {
                                        hasDealStatusReport ? <li>
                                            <Link to={`/admin/report/detailed-report/deal-status-report`} 
                                                className={`${
                                                    isAnyPathActive(location, ['/admin/report/detailed-report/deal-status-report']) ? "active" : ""
                                                }`}
                                            >
                                                <span className="menu-item">Deal Status Report</span>
                                            </Link>
                                        </li> : null
                                    }  
                                </ul>
                            </li> : null
                        }
                        {
                            hasUpdateSettings ? 
                            <li className={`${isAnyPathActive(location, ['/admin/settings/general']) ? "mm-active" : ""} ${getMenuClasses('settings').liClass}`}>
                                <Link to={`/admin/settings/general`} 
                                    onClick={() => handleMenuToggle('settings')}
                                    className={`${
                                        isAnyPathActive(location, ['/admin/settings/general']) ? "active" : ""
                                    }`}
                                >
                                    <i className="bx bx-cog nav-icon"></i>
                                    <span className="menu-item">Settings</span>
                                </Link>
                            </li> : null
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default withRouter(SideNavigation);
