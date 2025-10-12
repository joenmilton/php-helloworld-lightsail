
import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchBankList } from '../../../redux';
import AdminSettingsNav from '../../../components/AdminSettingsNav';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';
import BankTable from './component/BankTable';

function BankSettings({ fetchBankList }) {
    const { toggleSidebar } = useContext(SidebarContext);

    return (
        <div className="row g-2">
            <div className="col-lg-auto">
                <div className="d-flex">
                    <div className="flex-grow-1">
                        <div className="sub-head">Bank Accounts</div>
                    </div>
                </div>
            </div>
            <div className="col-auto ms-sm-auto">
                <div className="justify-content-sm-end">   
                    <button 
                        type="button" 
                        className="btn btn-purple"
                        onClick={() => toggleSidebar('bank')}
                    >
                        <i className="mdi mdi-plus me-1"></i> 
                        Create
                    </button>
                </div>
            </div>
            <div className="col-md-12">
                <BankTable />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
    fetchBankList
};
  
export default connect(mapStateToProps, mapDispatchToProps)(BankSettings);