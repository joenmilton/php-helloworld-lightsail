import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addRole, saveRole, updateInitialPermissionSet } from '../../../../redux';
import Select from 'react-select';

const RoleForm = ({ 
    id, formType, onClose,
    saveLoading, role, permissions, initialPermission, 
    addRole, saveRole, updateInitialPermissionSet
}) => {
    const [errors, setError]                        = useState({});

    const roleChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedRecord = {
                    ...role,
                    name: value,
                };
                addRole(updatedRecord);
                break;
            }
            default:
                break;
        }
    };

    const handleSave = async (e) => {
        const updatedRole = {
            ...role,
            permissions: initialPermission
        }

        const response = await saveRole(updatedRole);

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            // onClose();
        }
    }




    const handlePermissionChange = (selectedOption, e, permissions) => {
        const valuesToRemove = permissions.map(item => item.value);
        const filteredArray2 = initialPermission.filter(value => !valuesToRemove.includes(value));

        if(selectedOption.value) {
            filteredArray2.push(selectedOption.value);
        }

        updateInitialPermissionSet(filteredArray2)
    }

    const selectValueMap = (viewPermissions, initialPermission) => {
        const revokedPermission = viewPermissions.find(permission => permission.value === false);

        for (const permission of viewPermissions) {
            if (initialPermission.includes(permission.value)) {
                return permission;
            }
        }

        console.log(revokedPermission)
        return revokedPermission || null;
    };

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
                            (role.name) ? role.name : 'Create Role'
                        }
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">

                            <div className="mb-3">
                                <label className="form-label" htmlFor="name">
                                    <span className="text-danger me-1">*</span>
                                    Name
                                </label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={role.name}
                                    onChange={roleChange}
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
                                <div className="sub-head">Permissions</div>
                                {permissions?.grouped && permissions?.grouped?.length > 0 ? (
                                    permissions?.grouped.map((group, index) => (
                                        <div key={index}>
                                            <div className="sub-head-font mt-4">{group.as}</div>
                                            {group.views.length > 0 ? (
                                                group.views.map((view, viewIndex) => (
                                                    <div className="d-flex justify-content-between align-items-center" key={viewIndex}>
                                                        <div className="text-muted mt-2">{view.as}</div>
                                                        <div className="permission-select">
                                                            <Select
                                                                name={`${group.as}-${view.as}`}
                                                                value={selectValueMap(view.permissions, initialPermission)}
                                                                classNamePrefix="react-select"
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                        ...baseStyles,
                                                                        border: (state.isSelected) ? 0 : 0,
                                                                        borderColor: (state.isSelected) ? '#ccc' : '#ccc'
                                                                    }),
                                                                    indicatorSeparator: (baseStyles, state) => ({
                                                                        ...baseStyles,
                                                                        backgroundColor: 'inherit'
                                                                    }),
                                                                }}
                                                                onChange={(a,b) => handlePermissionChange(a,b, view.permissions)}
                                                                options={view.permissions}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No views available</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div>No permissions available</div>
                                )}
                            </div>
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
    saveLoading: state.role.saveLoading,
    role: state.role.detail,
    permissions: state.role.permission_group,
    initialPermission: state.role.initial_permission
});

const mapDispatchToProps = {
    addRole,
    saveRole,
    updateInitialPermissionSet
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleForm);