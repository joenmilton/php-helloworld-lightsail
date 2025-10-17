
import { 
    getJournalSettings, 
    createMasterDomain, 
    createMasterService,
    createMasterPublisher,
    createMasterJournal,
    createMasterActivity,
    
    createJournalPaper,
    updateJournalPaper,
    createJournalProcessing,
    updateJournalProcessing,
    createProcessRevision,
    updateProcessRevision,
    createProcessProof,
    updateProcessProof,
    updateProcessSheet,

    getJournalPaperList,
    getDealJournalPaperList
} from "../../service/JournalService";
import notificationService from "../../service/NotificationService";

export const SET_JOURNAL_ACTIVE_CONDITION   = 'SET_JOURNAL_ACTIVE_CONDITION';

export const JOURNAL_SETTINGS_LOADING       = 'JOURNAL_SETTINGS_LOADING';
export const ADD_JOURNAL_SETTINGS           = 'ADD_JOURNAL_SETTINGS';
export const JOURNAL_SETTINGS_RESET         = 'JOURNAL_SETTINGS_RESET';
export const ADD_JOURNAL                    = 'ADD_JOURNAL';
export const ADD_JOURNAL_LIST               = 'ADD_JOURNAL_LIST';
export const JOURNAL_SET_SAVE_LOADING       = 'JOURNAL_SET_SAVE_LOADING';
export const JOURNAL_LIST_LOADING           = 'JOURNAL_LIST_LOADING';
export const JOURNAL_LIST_RELOADING         = 'JOURNAL_LIST_RELOADING';
export const JOURNAL_INITIALIZED            = 'JOURNAL_INITIALIZED';

export const ADD_JOURNAL_PROCESSING         = 'ADD_JOURNAL_PROCESSING';
export const ADD_PROCESS_REVISION           = 'ADD_PROCESS_REVISION';
export const ADD_PROCESS_PROOF              = 'ADD_PROCESS_PROOF';
export const ADD_PROCESS_SHEET              = 'ADD_PROCESS_SHEET';

export const UPDATE_JOURNAL_PROCESSING      = 'UPDATE_JOURNAL_PROCESSING';

export const UPDATE_JOURNAL_SEARCH_QUERY    = 'UPDATE_JOURNAL_SEARCH_QUERY';
export const UPDATE_JOURNAL_SORT_ORDER      = 'UPDATE_JOURNAL_SORT_ORDER';


export const fetchDealJournalPaperList = (params) => {
    return async (dispatch) => {
        try {
            dispatch({type: JOURNAL_INITIALIZED, payload: false})
            const response = await getDealJournalPaperList(params);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addJournalPaperList(list));
            }
            dispatch({type: JOURNAL_INITIALIZED, payload: true})
        } catch (error) {
            console.error("Failed to fetch payment:", error);
            dispatch({type: JOURNAL_INITIALIZED, payload: true})
            return null;
        }
    };
};

export const fetchJournalPaperList = (queryParams, condition) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_LIST_LOADING, payload: true });
            const response = await getJournalPaperList(queryParams, condition);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addJournalPaperList(list));
                dispatch(reloadList(false))
            }
            dispatch({ type: JOURNAL_LIST_LOADING, payload: false });
        } catch (error) {
            console.error("Failed to fetch admin:", error);
            dispatch({ type: JOURNAL_LIST_LOADING, payload: false });
        }
    };
};

export const addJournalPaperList = (list) => ({
    type: ADD_JOURNAL_LIST,
    payload: list
});

export const saveProcessRevision = (revisionDetail) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: true });

            let response;
            if (!revisionDetail.id) {
                response = await createProcessRevision(revisionDetail);
            } else {
                response = await updateProcessRevision(revisionDetail.id, revisionDetail);
            }

            if (response.httpCode === 200) {
                dispatch(addJournalPaperList(response.data));
                dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });

                notificationService.success( (!revisionDetail.id) ? 'Journal revision created!' : 'Journal revision updated!');
                return response;
            }

            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            console.error("Failed to save:", error);
            return false;
        }
    };
};

export const saveProcessProof = (proofDetail) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: true });

            let response;
            if (!proofDetail.id) {
                response = await createProcessProof(proofDetail);
            } else {
                response = await updateProcessProof(proofDetail.id, proofDetail);
            }

            if (response.httpCode === 200) {
                dispatch(addJournalPaperList(response.data));
                dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });

                notificationService.success( (!proofDetail.id) ? 'Copy & Proof created!' : 'Copy & Proof updated!');
                return response;
            }

            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            console.error("Failed to save:", error);
            return false;
        }
    };
};

export const saveJournalProcessing = (processingDetail) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: true });

            let response;
            if (!processingDetail.id) {
                response = await createJournalProcessing(processingDetail);
            } else {
                response = await updateJournalProcessing(processingDetail.id, processingDetail);
            }

            if (response.httpCode === 200) {
                dispatch(addJournalPaperList(response.data));
                dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });

                notificationService.success( (!processingDetail.id) ? 'Journal processing entry created!' : 'Journal processing entry updated!');
                return response;
            }

            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            console.error("Failed to save:", error);
            return false;
        }
    };
};

export const saveJournal = (journal) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: true });

            let response;
            if (!journal.id) {
                response = await createJournalPaper(journal);
            } else {
                response = await updateJournalPaper(journal.id, journal);
            }

            if (response.httpCode === 200) {
                dispatch(addJournalPaperList(response.data));
                dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });

                notificationService.success( (!journal.id) ? 'Journal paper created!' : 'Journal paper updated!');
                return response;
            }

            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            console.error("Failed to save product:", error);
            return false;
        }
    };
};

export const saveMasterDomain = (value, queryFilter) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: true });
            const masterResponse = await createMasterDomain(value);

            if (masterResponse.httpCode === 200) {
                const id = masterResponse?.data?.id
  
                const response = await getJournalSettings(queryFilter);
                if (response.httpCode === 200) {
                    const settings = response.data;
                    dispatch(addJournalSettings(settings));
                }

                dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
                return id;
            }

            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create domain');
            return false;
        } catch (error) {
            console.log(error)
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create domain');
            return false;
        }
    }
}

export const saveMasterService = (value, queryFilter) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: true });
            const masterService = await createMasterService(value);
            if (masterService.httpCode === 200) {
                const id = masterService?.data?.id

                const response = await getJournalSettings(queryFilter);
                if (response.httpCode === 200) {
                    const settings = response.data;
                    dispatch(addJournalSettings(settings));
                }

                dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
                return id;
            }

            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create service');
            return false;
        } catch (error) {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create service');
            return false;
        }
    }
}

export const saveMasterPublisher = (value, queryFilter) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: true });
            const masterPublisher = await createMasterPublisher(value);
            if (masterPublisher.httpCode === 200) {
                const id = masterPublisher?.data?.id

                const response = await getJournalSettings(queryFilter);
                if (response.httpCode === 200) {
                    const settings = response.data;
                    dispatch(addJournalSettings(settings));
                }

                dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
                return id;
            }

            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create publisher');
            return false;
        } catch (error) {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create publisher');
            return false;
        }
    }
}

export const saveMasterJournal = (value, publisherId, queryFilter) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: true });
            const masterJournal = await createMasterJournal(value, publisherId);
            if (masterJournal.httpCode === 200) {
                const id = masterJournal?.data?.id

                const response = await getJournalSettings(queryFilter);
                if (response.httpCode === 200) {
                    const settings = response.data;
                    dispatch(addJournalSettings(settings));
                }

                dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
                return id;
            }

            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create publisher');
            return false;
        } catch (error) {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create publisher');
            return false;
        }
    }
}

export const saveMasterActivity = (value, queryFilter) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: true });
            const masterActivity = await createMasterActivity(value);
            if (masterActivity.httpCode === 200) {
                const id = masterActivity?.data?.id

                const response = await getJournalSettings(queryFilter);
                if (response.httpCode === 200) {
                    const settings = response.data;
                    dispatch(addJournalSettings(settings));
                }

                dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
                return id;
            }

            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create publisher');
            return false;
        } catch (error) {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
            notificationService.error('Failed to create publisher');
            return false;
        }
    }
}

export const loadJournalSettings = (queryParams) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: true });

            const response = await getJournalSettings(queryParams);
            if (response.httpCode === 200) {
                const settings = response.data;

                const activeFilter = settings.filters.find(filter => filter.mark_default === true)
                if(activeFilter) {
                    dispatch(setJournalDefaultFilter(activeFilter));
                    dispatch({ type: SET_PAYMENT_ACTIVE_CONDITION, payload: activeFilter })
                }

                dispatch(addJournalSettings(settings));
            }

            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: JOURNAL_SETTINGS_LOADING, payload: false });
        }
    }
}

export const addJournalSettings = (settings) => ({
    type: ADD_JOURNAL_SETTINGS,
    payload: settings,
});

export const addJournal = (journal) => ({
    type: ADD_JOURNAL,
    payload: journal,
});

export const addJournalProcessing = (journalProcessing) => ({
    type: ADD_JOURNAL_PROCESSING,
    payload: journalProcessing,
});

export const addProcessRevision = (processRevision) => ({
    type: ADD_PROCESS_REVISION,
    payload: processRevision,
});

export const addProcessSheet = (processSheet) => ({
    type: ADD_PROCESS_SHEET,
    payload: processSheet,
});

export const addProcessProof = (processProof) => ({
    type: ADD_PROCESS_PROOF,
    payload: processProof,
});

export const updateProcessOpenFlag = (journalProcessing) => ({
    type: UPDATE_JOURNAL_PROCESSING,
    payload: journalProcessing,
});


export const updateJournalSearchQuery = (value) => ({
    type: UPDATE_JOURNAL_SEARCH_QUERY,
    payload: value,
});

export const updateSheetSortOrder = (value) => ({
    type: UPDATE_JOURNAL_SORT_ORDER,
    payload: value,
});

export const reloadList = (value) => ({
    type: JOURNAL_LIST_RELOADING,
    payload: value,
});


export const saveProcessSheet = (sheetDetail) => {
    return async (dispatch) => {
        try {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: true });

            if (!sheetDetail.id) {
                notificationService.error('Sheet not valid!');
            }

            const updatedSheet = {
                id: sheetDetail?.id,
                submission_date: sheetDetail?.submission_date,
                due_date: sheetDetail?.due_date,
                publisher_status: sheetDetail?.publisher_status,
                current_revision_id: sheetDetail?.current_revision_id,
                extra_info: sheetDetail?.extra_info,
                url: sheetDetail?.url,
                current_revision: {
                    id: sheetDetail?.current_revision?.id,
                    revision_type: sheetDetail?.current_revision?.revision_type,
                    tech_status: sheetDetail?.current_revision?.tech_status,
                    due_date: sheetDetail?.current_revision?.due_date,
                    submission_date: sheetDetail?.current_revision?.submission_date,
                    activity_id: sheetDetail?.current_revision?.activity_id,
                    revised_by: sheetDetail?.current_revision?.revised_by,
                    enable_task_attach: sheetDetail?.current_revision?.enable_task_attach,
                    fetch_as: sheetDetail?.current_revision?.fetch_as,
                },
                next_revision: {
                    flag: sheetDetail?.next_revision?.flag,
                    revision_type: sheetDetail?.next_revision?.revision_type,
                    tech_status: sheetDetail?.next_revision?.tech_status,
                    due_date: sheetDetail?.next_revision?.due_date,
                    submission_date: sheetDetail?.next_revision?.submission_date,
                    activity_id: sheetDetail?.next_revision?.activity_id,
                    revised_by: sheetDetail?.next_revision?.revised_by,
                    enable_task_attach: sheetDetail?.next_revision?.enable_task_attach,
                    fetch_as: sheetDetail?.next_revision?.fetch_as,
                }
            }
            const response = await updateProcessSheet(sheetDetail.id, updatedSheet);

            if (response.httpCode === 200) {
                dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
                dispatch(reloadList(true))
                notificationService.success('Sheet updated');
                return response;
            }

            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: JOURNAL_SET_SAVE_LOADING, payload: false });
            console.error("Failed to save:", error);
            return false;
        }
    };
};










import { createFilterCondition } from "../../service/FilterService";

export const ADD_JOURNAL_CONDITION                  = 'ADD_JOURNAL_CONDITION';
export const CHANGE_JOURNAL_CONDITION               = 'CHANGE_JOURNAL_CONDITION';
export const UPDATE_JOURNAL_CONDITION_RULE          = 'UPDATE_JOURNAL_CONDITION_RULE';
export const UPDATE_JOURNAL_CONDITION_VALUE         = 'UPDATE_JOURNAL_CONDITION_VALUE';
export const REMOVE_JOURNAL_CONDITION               = 'REMOVE_JOURNAL_CONDITION';
export const JOURNAL_CONDITION_SET_SAVE_LOADING     = 'JOURNAL_CONDITION_SET_SAVE_LOADING';

import { SET_DEFAULT_FILTER } from "../filter/action";
export const SET_JOURNAL_DEFAULT_FILTER             = 'SET_JOURNAL_DEFAULT_FILTER';

export const UPDATE_JOURNAL_FILTER_LIST             = 'UPDATE_JOURNAL_FILTER_LIST';

export const setJournalDefaultFilter = (data) => {
    return async (dispatch) => {
        try {
            await dispatch({ type: SET_DEFAULT_FILTER, payload: data });
            await dispatch({ type: SET_JOURNAL_DEFAULT_FILTER, payload: data });
        } catch (error) {
            console.log('clear default filter error')
        }
    }
}


export const changeJournalCondition = (condition) => ({
    type: CHANGE_JOURNAL_CONDITION,
    payload: condition
});

export const addNewJournalCondition = (rule) => ({
    type: ADD_JOURNAL_CONDITION,
    payload: rule
});

export const updateJournalOptionRule = (index, data) => ({
    type: UPDATE_JOURNAL_CONDITION_RULE,
    payload: { index, data }
});

export const updateJournalOptionValue = (index, value) => ({
    type: UPDATE_JOURNAL_CONDITION_VALUE,
    payload: {index, value}
});

export const removeJournalCondition = (index) => ({
    type: REMOVE_JOURNAL_CONDITION,
    payload: index
});

export const saveJournalFilterCondition = (activityFilter) => {
    return async (dispatch) => {
        try {
            dispatch({type: JOURNAL_CONDITION_SET_SAVE_LOADING, payload: true})

            const response = await createFilterCondition(activityFilter);
            if (response.httpCode === 200) {
                dispatch({type: UPDATE_JOURNAL_FILTER_LIST, payload: response?.data?.filters})
            }

            dispatch({type: JOURNAL_CONDITION_SET_SAVE_LOADING, payload: false})
            return response;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            dispatch({type: JOURNAL_CONDITION_SET_SAVE_LOADING, payload: false})
            notificationService.error('Failed to save filter');
        }
    };
};
