
import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import AdminSettingsNav from '../../../components/AdminSettingsNav';
import AdminSettingsUsersNav from '../../../components//AdminSettingsUsersNav';
import RoleTable from './component/RoleTable';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';
import { fetchPrmissionGroup, updateInitialPermissionSet, resetRole } from '../../../redux';

function RoleSettings({ permissions, fetchPrmissionGroup, updateInitialPermissionSet, resetRole }) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if((permissions && !permissions?.grouped) || (permissions && permissions?.grouped && permissions?.grouped.length <= 0)) {
            fetchPrmissionGroup();
        }
    }, [permissions]);

    const onRoleCreateButton = () => {
        resetRole()
        updateInitialPermissionSet(permissions.initial)
        toggleSidebar('role')
    }

    return (
        <>
        <AdminSettingsUsersNav/>
            <div className="row g-2 my-2">
                <div className="col-lg-auto">
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <div className="sub-head">Roles</div>
                        </div>
                    </div>
                </div>
                <div className="col-auto ms-sm-auto">
                    <div className="justify-content-sm-end">   
                        <button 
                            type="button" 
                            className="btn btn-purple"
                            onClick={onRoleCreateButton}
                        >
                            <i className="mdi mdi-plus me-1"></i> 
                            Create Role
                        </button>
                    </div>
                </div>

                <div className="col-md-12">
                    <RoleTable />
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    permissions: state.role.permission_group,
});

const mapDispatchToProps = {
    fetchPrmissionGroup,
    updateInitialPermissionSet,
    resetRole
};
  
export default connect(mapStateToProps, mapDispatchToProps)(RoleSettings);