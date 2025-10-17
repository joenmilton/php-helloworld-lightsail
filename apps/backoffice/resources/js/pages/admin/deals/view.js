
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadDealSettings, fetchDeal } from '../../../redux';
import ActionModule from './component/ActionModule';
import DealProgress from './component/Progress'
import DealDetail from './component/Detail'
import DealClient from './component/Client'
import DealBranch from './component/Branch'
import DealUser from './component/User'
import NavModule from './component/NavModule';
import { formatDate } from '../../../utils';
import { Link } from 'react-router-dom';

function ViewDeal({ 
    initialized, settingsInitialized, deal, 
    loadDealSettings, fetchDeal 
}) {
    const { dealId }        = useParams();


    useEffect(async() => {
        const queryFilter = { deal_id: dealId }
        await loadDealSettings(queryFilter);
        await fetchDeal(dealId);
    }, [dealId]);

    return (
        
        <>
        <div className="container">
            <div className="card shadow-sm">
                {
                    (initialized && deal?.parent_id) ? <div className="custom-ribbon">CLONE</div> : null
                }
                <div className="card-body">
                    {
                        (!initialized) ? <div className="progress">
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="98" aria-valuemin="0" aria-valuemax="100" style={{width: '98%'}}></div>
                        </div> : <div className="row mb-2">
                            <div className="col-md-6">
                                <div>
                                    <span className="ms-0 logo-txt">{deal?.name}</span>
                                    <ol className="breadcrumb p-0 bg-transparent mb-2">
                                        <li className="breadcrumb-item active">
                                            {deal?.pipeline?.name}
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {deal?.stage?.name}
                                        </li>
                                    </ol>
                                    <p className="text-secondary">Created At {formatDate(deal?.created_at)}</p>
                                </div>
                            </div>

                            <div className="col-md-6 position-relative">
                                <ActionModule />
                            </div>
                        </div>
                    }
                    <DealProgress />
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-md-12 col-lg-4">
                    <DealBranch />
                    <DealDetail />
                    <DealClient />
                    <DealUser />
                </div>
                <div className="col-md-12 col-lg-8">
                    <NavModule />
                </div>
            </div>
        </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    settingsInitialized: state.deal.settingsInitialized,
    initialized: state.deal?.initialized,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    loadDealSettings,
    fetchDeal
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ViewDeal);