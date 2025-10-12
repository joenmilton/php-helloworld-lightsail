
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import AdminSettingsNav from '../../../components/AdminSettingsNav';
import AdminSettingsUsersNav from '../../../components/AdminSettingsUsersNav';
import TeamTable from './component/TeamTable';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';
import { resetTeam } from '../../../redux';

function TeamSettings({ resetTeam }) {
    const { toggleSidebar } = useContext(SidebarContext);

    const onTeamCreateButton = () => {
        resetTeam()
        toggleSidebar('team')
    }

    return (
        <>
            <AdminSettingsUsersNav/>
            <div className="row g-2 my-2">
                <div className="col-lg-auto">
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <div className="sub-head">Teams</div>
                        </div>
                    </div>
                </div>
                <div className="col-auto ms-sm-auto">
                    <div className="justify-content-sm-end">   
                        <button 
                            type="button" 
                            className="btn btn-purple"
                            onClick={onTeamCreateButton}
                        >
                            <i className="mdi mdi-plus me-1"></i> 
                            Create Team
                        </button>
                    </div>
                </div>

                <div className="col-md-12">
                    <TeamTable />
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
    resetTeam
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TeamSettings);