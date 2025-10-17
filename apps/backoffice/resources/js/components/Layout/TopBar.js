import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { formatDate } from '../../utils';
import { fetchNotificationList, markAllNotification } from '../../redux';
import socket from '../../service/socket';
import AuthService from '../../service/AuthService';

const TopBar = ({ 
    toggleSidebar,
    initialized, listLoading, notificationData, user, 

    fetchNotificationList, markAllNotification
}) => {
    const history = useHistory();
    
    useEffect(() => {
        if(user && user?.id) {
            socket.emit('subscribe', `user.${user?.id}`);
            socket.on('notification.sent', (notification) => {
                console.log('Notification received:', notification);
                fetchNotificationList({}); // Fetch the updated notification list
            });
            return () => {
                socket.off('notification.sent');
            };
        }
    }, [user]);

    useEffect(async() => {
        if(!initialized) {
            const queryFilter = {}
            await fetchNotificationList(queryFilter);
        }
    }, [initialized])

    const markAllNotificationRead = async (e) => {
        e.preventDefault();
        const queryFilter = {};
        await markAllNotification(queryFilter);
    };

    const handleNotificationClick = (notification) => {
        let fullPath = '';
        // console.log(notification?.data?.action);
        
        if( notification?.data?.action === 'deal_shared') {
            fullPath = `/admin${notification.link}/edit`;
            history.push(fullPath);
        } else { }
    };

    const logout = async () => {
        try {
            // Call the logout API
            await AuthService.logout();
            
            // Redirect to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, redirect to login page
            window.location.href = '/login';
        }
    }

    return (
        <header id="page-topbar">
            <div className="navbar-header">
                <div className="d-flex">
                    <div className="navbar-brand-box">
                        <a href="/" className="logo logo-dark">
                            <span className="logo-sm">
                                <img src="/assets/images/logo-sm.svg" alt="" height="26" />
                            </span>
                            <span className="logo-lg">
                                <img src="/assets/images/logo-sm.svg" alt="" height="26" /> <span className="logo-txt">Vusey</span>
                            </span>
                        </a>
            
                        <a href="/" className="logo logo-light">
                            <span className="logo-sm">
                                <img src="/assets/images/logo-sm.svg" alt="" height="26" />
                            </span>
                            <span className="logo-lg">
                                <img src="/assets/images/logo-sm.svg" alt="" height="26" /> <span className="logo-txt">Vusey</span>
                            </span>
                        </a>
                    </div>
                    <button type="button" className="btn btn-sm px-3 header-item vertical-menu-btn noti-icon" onClick={toggleSidebar}>
                        <i className="fa fa-fw fa-bars font-size-16"></i>
                    </button>
                </div>
        
                <div className="d-flex">
                    <div className="dropdown d-inline-block">
                        <button type="button" className="btn header-item noti-icon" id="page-header-notifications-dropdown"
                            data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                            <i className="bx bx-bell icon-sm"></i>
                            {
                                (notificationData?.unread_count && notificationData?.unread_count > 0) ? <span className="noti-dot bg-danger rounded-pill">{notificationData?.unread_count}</span> : null
                            }
                        </button>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                            aria-labelledby="page-header-notifications-dropdown">
                            <div className="p-3" style={{borderBottom:'1px solid #e1e1e1'}}>
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-0 font-size-15"> Notifications </h5>
                                    </div>
                                    <div className="col-auto">
                                        {
                                            (listLoading) ? <div className="spinner-border spinner-18 text-secondary me-2" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : <a href="" onClick={(e) => markAllNotificationRead(e)} className="small">Mark all as read</a>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div style={{maxHeight:'350px', overflowY:'scroll'}}>
                                {
                                    (notificationData?.notifications?.data) ? notificationData?.notifications?.data.map((notification, index) => {
                                        return (
                                            <div 
                                                key={index} 
                                                className={`text-reset notification-item ${!notification.is_read ? 'unread-notification' : ''}`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                
                                                <div className="d-flex border-bottom align-items-start">
                                                    <div className="flex-shrink-0">
                                                        
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{notification?.title}</h6>
                                                        <div className="text-muted">
                                                            <p className="mb-1 font-size-13">{notification?.message}</p>
                                                            <p className="mb-0 font-size-10 text-uppercase fw-bold"><i className="mdi mdi-clock-outline me-1"></i>{formatDate(notification?.updated_at, 'date')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : null
                                }
                            </div>
                            <div className="p-2 border-top d-grid">
                                <a className="btn btn-sm btn-link font-size-14 btn-block text-center" href="">
                                    <i className="uil-arrow-circle-right me-1"></i> <span>View More..</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="dropdown d-inline-block">
                        <button type="button" className="btn header-item user text-start d-flex align-items-center" id="page-header-user-dropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img className="rounded-circle header-profile-user" src="/assets/images/users/avatar-2.jpg"alt="Header Avatar" />
                            <span className="ms-2 d-none d-xl-inline-block user-item-desc">
                                <span className="user-name">{user?.name}<i className="mdi mdi-chevron-down"></i></span>
                            </span>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end pt-0">
                            <h6 className="dropdown-header">Welcome {user?.name}</h6>
                            <a className="dropdown-item" href="/"><i className="bx bx-user-circle text-muted font-size-16 align-middle me-1"></i> <span className="align-middle">Profile</span></a>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item" onClick={() => logout()}>
                                <i className="mdi mdi-logout text-muted font-size-16 align-middle me-1"></i> 
                                <span className="align-middle">Logout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
const mapStateToProps = (state) => ({
    user: state.common?.settings?.user,
    initialized: state.notification?.initialized,
    listLoading: state.notification?.listLoading,
    notificationData: state.notification?.list,
});
const mapDispatchToProps = {
    fetchNotificationList,
    markAllNotification
};
export default connect(mapStateToProps, mapDispatchToProps)(TopBar);