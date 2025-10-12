import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    addJournal,
    addJournalProcessing,
    fetchDealJournalPaperList
} from '../../../../../../../redux';
import { formatDate, mergeApiDateWithIso } from '../../../../../../../utils';
import { SidebarContext } from '../../../../../../../components/Sidebar/contexts/SidebarContext';
import Processing from './Processing';

const Journals = ({ 
    type, 
    journal, journalSettingsInitialized, activitySettingsInitialized,
    addJournal, addJournalProcessing, fetchDealJournalPaperList
}) => {
    const { dealId } = useParams();
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        const initialize = async() => {
            await fetchDealJournalPaperList({
                current_page: 1,
                per_page: 10000,
                dealId: dealId
            })
        };
        initialize();
    }, []);

    const onPaperEntryCreateButton = (dealId, paperId) => {
        const processingDetail = {
            id: '',
            paper_id: paperId,
            publisher_id: '',
            journal_id: '',
            process_status: '',
            url: '',
    
            revised_by: '',
            activity_id: null,
            revision_date: '',
            submission_date: '',
            status: '',
    
            enable_task_attach: false,
            fetch_as: 'new'
        }
        addJournalProcessing(processingDetail)

        toggleSidebar('journal_processing', null, {dealId: dealId})
    }

    const onJournalsEditButton = (dealId, paper) => {
        const updatedPaper = {
            ...paper,
            deadline: (paper?.deadline) ? mergeApiDateWithIso(paper?.deadline) : paper?.deadline,
            confirmation_date: (paper?.confirmation_date) ? mergeApiDateWithIso(paper?.confirmation_date) : paper?.confirmation_date
        }
        addJournal(updatedPaper)
        toggleSidebar('deal_journal', paper?.id, {dealId: dealId})
    }

    return (
        <div className="card-body">
            <div className="d-block">
                <div>
                {
                    (!journal?.initialized || !journalSettingsInitialized || !activitySettingsInitialized) ? <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary m-1" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> : 
                    <>
                        <div className="accordion accordion-flush" id="accordionJournalFlush">
                        {
                            (journal?.list?.data.length > 0) ? journal?.list?.data.map((paper, index) => {
                                return (
                                    <div key={index} className="accordion-item">
                                        <h2 className="accordion-header" id={`flush-heading${index}`}>
                                            <button className="accordion-button font-size-15 lh-sm logo-txt sub-text collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                                                <div className="d-flex justify-content-between align-items-center border-bottom-0 w-100">
                                                    <div>{String(index + 1).padStart(2, '#')} - {paper?.paper}</div>
                                                    <div className="me-2"></div>
                                                </div>
                                            </button>
                                        </h2>
                                        <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionJournalFlush">
                                            <div className="accordion-body">
                                                <div className="d-block">
                                                    <div className="row ">


                                                        <div className="col-xl-3 col-sm-6">
                                                            <div className="card">
                                                                <div className="card-body p-2 position-relative paper-hover">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="flex-shrink-0 me-3">
                                                                            <div className="avatar">
                                                                                <div className="avatar-title bg-primary-subtle rounded font-size-20 text-primary">
                                                                                    <i className="uil uil-list-ul"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="font-size-16 mb-1">{paper?.domain ? paper?.domain?.name : '-'}</h5>
                                                                            <p className="mb-0 text-truncate text-muted">Domain</p>
                                                                        </div>
                                                                    </div>
                                                                    <button className="btn btn-light btn-sm ms-2 position-absolute rounded-3 end-0 bottom-0 me-1 mb-1 paper-edit" onClick={() => onJournalsEditButton(dealId, paper)}>
                                                                        <i className="uil uil-pen"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-3 col-sm-6">
                                                            <div className="card">
                                                                <div className="card-body p-2 positive-relative paper-hover">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="flex-shrink-0 me-3">
                                                                            <div className="avatar">
                                                                                <div className="avatar-title bg-primary-subtle rounded font-size-20 text-primary">
                                                                                    <i className="uil uil-clock-eight"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="font-size-16 mb-1">{ paper?.service ? paper?.service?.name : '-' }</h5>
                                                                            <p className="mb-0 text-truncate text-muted">Service</p>
                                                                        </div>
                                                                    </div>
                                                                    <button className="btn btn-light btn-sm ms-2 position-absolute rounded-3 end-0 bottom-0 me-1 mb-1 paper-edit" onClick={() => onJournalsEditButton(dealId, paper)}>
                                                                        <i className="uil uil-pen"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-3 col-sm-6">
                                                            <div className="card">
                                                                <div className="card-body p-2 positive-relative paper-hover">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="flex-shrink-0 me-3">
                                                                            <div className="avatar">
                                                                                <div className="avatar-title bg-primary-subtle rounded font-size-20 text-primary">
                                                                                    <i className="uil uil-clock-eight"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="font-size-16 mb-1">{paper?.confirmation_date ? formatDate(paper?.confirmation_date, 'shortdate') : '-' }</h5>
                                                                            <p className="mb-0 text-truncate text-muted" alt="Confirmation Date">Confirmation Date</p>
                                                                        </div>
                                                                    </div>
                                                                    <button className="btn btn-light btn-sm ms-2 position-absolute rounded-3 end-0 bottom-0 me-1 mb-1 paper-edit" onClick={() => onJournalsEditButton(dealId, paper)}>
                                                                        <i className="uil uil-pen"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-3 col-sm-6">
                                                            <div className="card">
                                                                <div className="card-body p-2 positive-relative paper-hover">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="flex-shrink-0 me-3">
                                                                            <div className="avatar">
                                                                                <div className="avatar-title bg-primary-subtle rounded font-size-20 text-primary">
                                                                                    <i className="uil uil-list-ul"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-grow-1 overflow-hidden">
                                                                            <h5 className="font-size-16 mb-1">{paper?.deadline ? formatDate(paper?.deadline, 'shortdate') : '-' }</h5>
                                                                            <p className="mb-0 text-truncate text-muted">Deadline</p>
                                                                        </div>
                                                                    </div>
                                                                    <button className="btn btn-light btn-sm ms-2 position-absolute rounded-3 end-0 bottom-0 me-1 mb-1 paper-edit" onClick={() => onJournalsEditButton(dealId, paper)}>
                                                                        <i className="uil uil-pen"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="d-flex my-2">
                                                        <div className="overflow-hidden me-auto"></div>
                                                        <div className="align-self-end ms-2">
                                                            <button type="button" className="btn btn-purple" onClick={() => onPaperEntryCreateButton(dealId, paper?.id)}>
                                                                <i className="mdi mdi-plus me-1"></i> Add New Entry
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Processing dealId={dealId} paper={paper}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : null
                        }
                        </div>
                    </>
                }
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    journalSettingsInitialized: state.journal.settingsInitialized,
    activitySettingsInitialized: state.activity.settingsInitialized,
    journal: state.journal
});

const mapDispatchToProps = {
    addJournal,
    addJournalProcessing,
    fetchDealJournalPaperList
};

export default connect(mapStateToProps, mapDispatchToProps)(Journals);