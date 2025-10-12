import React, { useState } from 'react';
import { connect } from 'react-redux';
import { changeActiveTab, addAdmin, saveAdmin } from '../../../../redux';
import PasswordGenerator from './PasswordGenerator';

const AdminForm = ({ 
    id, formType, onClose,
    saveLoading, activeTab, admin, settings, 
    changeActiveTab, addAdmin, saveAdmin
}) => {
    const [errors, setError]                        = useState({});
    
    const userFormTab = (type) => {
        changeActiveTab(type)
    }

    const adminChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedRecord = {
                    ...admin,
                    name: value,
                };
                addAdmin(updatedRecord);
                break;
            }
            case 'email': {
                updatedRecord = {
                    ...admin,
                    email: value,
                };
                addAdmin(updatedRecord);
                break;
            }
            case 'role_id': {
                updatedRecord = {
                    ...admin,
                    role_id: value,
                };
                addAdmin({
                    ...admin,
                    role_id: value,
                    is_superadmin: (value !== false) ? false : admin.is_superadmin,
                });
                break;
            }
            case 'password': {
                updatedRecord = {
                    ...admin,
                    password: value,
                };
                addAdmin(updatedRecord);
                break;
            }
            case 'password_confirmation': {
                updatedRecord = {
                    ...admin,
                    password_confirmation: value,
                };
                addAdmin(updatedRecord);
                break;
            }
            case 'is_superadmin': {
                updatedRecord = {
                    ...admin,
                    is_superadmin: e.target.checked,
                    role_id: (e.target.checked === false) ? admin.role_id : false
                };
                addAdmin(updatedRecord);
                break;
            }
            default:
                break;
        }
    };


    const handleSave = async (e) => {
        const response = await saveAdmin(admin);

        

        if(response.httpCode == 422) {

            const tab1_keys = ['name', 'email', 'role_id'];
            const tab2_keys = ['password', 'password_confirmation'];
            const tab3_keys = ['is_superadmin'];
            let tab = '';
            if(tab1_keys.some(key => Object.keys(response.errors).includes(key))) {
                tab = 'user'
            }
            if(tab2_keys.some(key => Object.keys(response.errors).includes(key))) {
                tab = 'password'
            }
            if(tab3_keys.some(key => Object.keys(response.errors).includes(key))) {
                tab = 'advanced'
            }
            setError(response.errors)
            changeActiveTab(tab)
        }

        if(response.httpCode === 200) {
            onClose();
        }
    }

    return (
        <>
            <div className="rightbar-title d-flex align-items-center pe-3">
                <a href="" onClick={(event) => { event.preventDefault(); onClose(); }} className="right-bar-toggle-close ms-auto">
                    <i className="mdi mdi-close noti-icon"></i>
                </a>
            </div>
            <div className="d-flex flex-column h-full w-screen">
                <div className="d-flex flex-column flex-equal overflow-x-hidden overflow-y-scroll py-4">
                    <h2 className="sub-head mb-3 px-4">
                        {
                            (admin.name) ? admin.name : 'Create User'
                        }
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">

                            <ul className="nav nav-tabs nav-tabs-custom nav-justified mb-4">
                                <li className="nav-item cursor-pointer" onClick={() => userFormTab('user')}>
                                    <a className={`nav-link ${activeTab === 'user' ? 'active' : ''}`}>
                                        <span className="d-block fw-semibold">User</span> 
                                    </a>
                                </li>
                                <li className="nav-item cursor-pointer" onClick={() => userFormTab('password')}>
                                    <a className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}>
                                        <span className="d-block fw-semibold">Password</span> 
                                    </a>
                                </li>
                                <li className="nav-item cursor-pointer" onClick={() => userFormTab('advanced')}>
                                    <a className={`nav-link ${activeTab === 'advanced' ? 'active' : ''}`}>
                                        <span className="d-block fw-semibold">Advanced</span>   
                                    </a>
                                </li>
                            </ul>
                            {
                                (activeTab === 'user') ? 
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="user_name">
                                            <span className="text-danger me-1">*</span>
                                            User Name
                                        </label>
                                        <input 
                                            type="text"
                                            name="name"
                                            id="user_name"
                                            value={admin.name}
                                            onChange={adminChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.name && (
                                            <div className="d-block invalid-feedback">
                                                {errors.name.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="email">
                                            <span className="text-danger me-1">*</span>
                                            Email Address
                                        </label>
                                        <input 
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={admin.email}
                                            onChange={adminChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.email && (
                                            <div className="d-block invalid-feedback">
                                                {errors.email.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="user_role">
                                            User Role
                                        </label>
                                        <select 
                                            id="user_role"
                                            name="role_id"
                                            className="form-control" 
                                            value={admin.role_id} 
                                            onChange={adminChange} 
                                            disabled={admin.is_superadmin}
                                        >
                                            <option value="">Select Role</option>
                                            {(settings?.roles) ? settings.roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            )) : <></>}
                                        </select>
                                        {errors.role_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.role_id.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div> : <></>
                            }
                            {
                                (activeTab === 'password') ? 
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="password">
                                            Password
                                        </label>
                                        <input 
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={admin.password}
                                            onChange={adminChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.password && (
                                            <div className="d-block invalid-feedback">
                                                {errors.password.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="password_confirmation">
                                            Confirm Password
                                        </label>
                                        <input 
                                            type="password"
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={admin.password_confirmation}
                                            onChange={adminChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.password_confirmation && (
                                            <div className="d-block invalid-feedback">
                                                {errors.password_confirmation.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <PasswordGenerator/>
                                    </div>
                                </div> : <></>
                            }
                            {
                                (activeTab === 'advanced') ? 
                                <div>
                                    <div className={`border border-2 rounded-2 p-4 ${(admin.is_superadmin) ? 'border-primary' : ''}`}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>Super Admin</div>
                                            <div>
                                                <div className="form-check form-switch form-switch-md me-2">
                                                    <input 
                                                        checked={admin.is_superadmin} 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        id="flexSwitchCheckChecked" 
                                                        name="is_superadmin" 
                                                        onChange={adminChange}
                                                    />
                                                    {errors.is_superadmin && (
                                                        <div className="d-block invalid-feedback">
                                                            {errors.is_superadmin.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-muted mt-2 mb-0">Enabling super admin access for the user will give full access to all features without any limitations.</p>
                                    </div>
                                </div> : <></>
                            }

                        </div>
                    </div>
                </div>
                <div>
                    <div className="px-4 py-2 sidebar-footer border-top-custom">
                        <div className="d-flex align-items-start"> 
                            <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                            <button type="button" disabled={saveLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                {saveLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    saveLoading: state.admin.saveLoading,
    activeTab: state.admin.activeTab,
    admin: state.admin.detail,
    settings: state.common.settings
});

const mapDispatchToProps = {
    changeActiveTab,
    addAdmin,
    saveAdmin
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminForm);