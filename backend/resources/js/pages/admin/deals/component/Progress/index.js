import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { changeStage } from '../../../../../redux';
import { Type } from "./type";

const DealProgress = ({ saveLoading, deal, processingStage, changeStage }) => {

    const { dealId }        = useParams();

    const changingStage = async (stageId, progressType, status) => {
        if(status !== '1') {
            return;
        }
        
        if(progressType === 'present' || saveLoading) {
            return;
        }

        await changeStage(dealId, stageId);
    }
    
    return (
        <nav className="deal-progress">
            <ol className="d-lg-flex flex-lg-wrap border-1 border-neutral-300 rounded-1 overflow-hidden list-inline mb-0">
                {
                    (deal?.pipeline?.stages && deal?.pipeline?.stages.length > 0) ? deal?.pipeline?.stages.map((stage ,index) => {
                        const isLast = index === deal.pipeline.stages.length - 1;
                        return (
                            <li onClick={() => changingStage(stage.id, stage.progress_type, deal.status)} key={stage.id} className={`progress-li position-relative d-lg-flex bg-neutral-50 flex-equal text-truncate overflow-hidden ${stage.progress_type}`}>
                                <a className="d-flex w-full" href="#" onClick={(e) => { e.preventDefault(); }}>
                                    <Type status={deal.status} type={stage.progress_type} labelValue={stage.name} stageId={stage.id} processing={processingStage}/>
                                </a>
                                {!isLast && (
                                    <div className="position-absolute d-none d-lg-block top-0 end-0 w-5 h-full">
                                        <svg className="h-full w-full text-neutral-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none"><path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round"></path></svg>
                                    </div>
                                )}
                            </li>
                        )
                    }) : <></>
                }
            </ol>
        </nav>
    )
};

const mapStateToProps = (state) => ({
    processingStage: state.deal.processingStage,
    saveLoading: state.deal.saveLoading,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    changeStage
};

export default connect(mapStateToProps, mapDispatchToProps)(DealProgress);