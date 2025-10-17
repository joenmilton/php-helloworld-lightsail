
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import AdminSettingsNav from '../../../components/AdminSettingsNav';
import AdminSettingsUsersNav from '../../../components//AdminSettingsUsersNav';
import UsersTable from './component/UsersTable';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';

function UserSettings({  }) {
    const { toggleSidebar } = useContext(SidebarContext);

    return (
        <>
            <AdminSettingsUsersNav/>
            <div className="row g-2 my-2">
                <div className="col-lg-auto">
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <div className="sub-head">Users</div>
                        </div>
                    </div>
                </div>
                <div className="col-auto ms-sm-auto">
                    <div className="justify-content-sm-end">   
                        <button 
                            type="button" 
                            className="btn btn-purple"
                            onClick={() => toggleSidebar('admin')}
                        >
                            <i className="mdi mdi-plus me-1"></i> 
                            Create User
                        </button>
                    </div>
                </div>

                <div className="col-md-12">
                    <UsersTable />
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);