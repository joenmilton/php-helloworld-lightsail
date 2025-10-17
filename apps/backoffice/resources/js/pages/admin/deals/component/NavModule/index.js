import React, { useState } from 'react';
import { TopBody } from './TopBody';
import { BottomBody } from './BottomBody';
import { connect } from 'react-redux';
import { useHasPermission } from '../../../../../utils/permissions';

const NavModule = ({ 
    permissions
}) => {
    const [navType, setNavType] = useState('All');
    const changingStage = (type) => {
        setNavType(type)
    }

    return (
        <div>
            <div className="card shadow-sm">
                <div className="card-header py-0">
                    <div className="d-flex align-items-center justify-content-center">
                        <ul className="nav nav-tabs nav-tabs-custom border-0" role="tablist">
                            <li className="nav-item cursor-pointer user-select-none" onClick={() => {changingStage('All')}}>
                                <div className="nav-link logo-txt sub-text py-3 active" data-bs-toggle="tab" role="tab" aria-selected="false">
                                    <i className="uil-align-left me-1"></i>All
                                </div>
                            </li>
                            {
                                ((useHasPermission(['view deal product'], permissions))) ? <li className="nav-item cursor-pointer user-select-none" onClick={() => {changingStage('Services')}}>
                                    <div className="nav-link logo-txt sub-text py-3" data-bs-toggle="tab" role="tab" aria-selected="true">
                                        <i className="uil-books me-1"></i>Services
                                    </div>
                                </li> : null
                            }
                            {
                                ((useHasPermission(['view deal payment'], permissions))) ? <li className="nav-item cursor-pointer user-select-none" onClick={() => {changingStage('Payments')}}>
                                    <div className="nav-link logo-txt sub-text py-3" data-bs-toggle="tab" role="tab" aria-selected="true">
                                        <i className="bx bx-money me-1"></i>Payments
                                    </div>
                                </li> : null
                            }
                            {
                                ((useHasPermission(['view deal journals'], permissions))) ? <li className="nav-item cursor-pointer user-select-none" onClick={() => {changingStage('Journals')}}>
                                    <div className="nav-link logo-txt sub-text py-3" data-bs-toggle="tab" role="tab" aria-selected="true">
                                        <i className="uil-book-open me-1"></i>Journals
                                    </div>
                                </li> : null
                            }
                            {
                                ((useHasPermission(['view own activities', 'view all activities', 'view deal activities'], permissions))) ? <li className="nav-item cursor-pointer user-select-none" onClick={() => {changingStage('Activities')}}>
                                    <div className="nav-link logo-txt sub-text py-3" data-bs-toggle="tab" role="tab" aria-selected="true">
                                        <i className="uil-calender me-1"></i>Activities
                                    </div>
                                </li> : null
                            }
                            
                        </ul>
                    </div>
                </div>
                <TopBody type={navType}/>
            </div>
            <BottomBody type={navType}/>
        </div>
    )
}

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(NavModule);