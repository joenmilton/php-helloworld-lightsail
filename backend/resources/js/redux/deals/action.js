
import { 
    getDeal, 
    getDealList, 
    createDeal, 
    updateDeal, 
    updateDealStage, 
    updateDealContact,
    remomveDealContact,
    updateDealOwner,
    updateDealStatus,
    getDealClonePipelines,
    getDealCloneUsers,
    setCloneDeal,

    getDealSettings,
    updatePipelineSettings,
} from "../../service/DealService";
import notificationService from "../../service/NotificationService";

import { DEAL_SET_SAVE_LOADING } from "../common/action";

export const SET_DEAL_ACTIVE_CONDITION   = 'SET_DEAL_ACTIVE_CONDITION';

export const BILL_INITIALIZED   = 'BILL_INITIALIZED';
export const ADD_DEAL_LIST      = 'ADD_DEAL_LIST';
export const DEAL_LIST_LOADING  = 'DEAL_LIST_LOADING';
export const ADD_DEAL           = 'ADD_DEAL';
export const UPDATE_DEAL        = 'UPDATE_DEAL';
export const UPDATE_EXPECTED_CLOSE_DATE           = 'UPDATE_EXPECTED_CLOSE_DATE';
export const PROCESSING_STAGE           = 'PROCESSING_STAGE';
export const DEAL_ACTION_SAVE_LOADING           = 'DEAL_ACTION_SAVE_LOADING';

export const CLEAR_CLONE                    = 'CLEAR_CLONE';
export const AVAILABLE_CLONE_PIPELINES      = 'AVAILABLE_CLONE_PIPELINES';
export const AVAILABLE_CLONE_USERS          = 'AVAILABLE_CLONE_USERS';
export const CLONE_PIPELINES_LOADING        = 'CLONE_PIPELINES_LOADING';
export const CLONE_USERS_LOADING            = 'CLONE_USERS_LOADING';
export const CLONE_ACTION_SAVE_LOADING      = 'CLONE_ACTION_SAVE_LOADING';

export const DEAL_SETTINGS_LOADING          = 'DEAL_SETTINGS_LOADING';
export const ADD_DEAL_SETTINGS              = 'ADD_DEAL_SETTINGS';
export const UPDATE_DEAL_SEARCH_QUERY       = 'UPDATE_DEAL_SEARCH_QUERY';
export const UPDATE_DEAL_SORT_ORDER         = 'UPDATE_DEAL_SORT_ORDER';
export const BULK_DEAL_ACTION_LOADING       = 'BULK_DEAL_ACTION_LOADING';
export const SET_BULK_DEAL_IDS              = 'SET_BULK_DEAL_IDS';

export const changePipelineDefault = (settings) => {
    return async (dispatch) => {
        try {
            dispatch(addDealSettings({ ...settings, activeLoader: settings.activeLoader}));
            const response = await updatePipelineSettings({
                pipelineId: settings.activePipeline
            });

            if (response.httpCode === 200) {
                const updatedSettings = response.data;
                dispatch(addDealSettings(updatedSettings));
            }

            return response;
        } catch (error) {
            return null;
        }
    }
}
export const changeDealView = (settings) => {
    return async (dispatch) => {
        try {
            dispatch(addDealSettings({ ...settings, activeLoader: 'dealView', activeView: '' }));

            const response = await updatePipelineSettings({
                activeView: settings.activeView
            });
            
            if (response.httpCode === 200) {
                const updatedSettings = response.data;
                dispatch(addDealSettings(updatedSettings));
            }
            
            return response;
        } catch (error) {
            return null;
        }
    }
}


export const updateDealSortOrder = (value) => ({
    type: UPDATE_DEAL_SORT_ORDER,
    payload: value,
});

export const updateDealSearchQuery = (value) => ({
    type: UPDATE_DEAL_SEARCH_QUERY,
    payload: value,
});

export const loadDealSettings = (queryParams = {}) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_SETTINGS_LOADING, payload: true });

            const response = await getDealSettings(queryParams);
            if (response.httpCode === 200) {
                const settings = response.data;

                const activeFilter = settings.filters.find(filter => filter.mark_default === true)
                if(activeFilter) {
                    dispatch(setDealDefaultFilter(activeFilter));
                    dispatch({ type: SET_DEAL_ACTIVE_CONDITION, payload: activeFilter })
                }

                dispatch(addDealSettings(settings));
            }

            dispatch({ type: DEAL_SETTINGS_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: DEAL_SETTINGS_LOADING, payload: false });
            return null;
        }
    }
}
export const addDealSettings = (settings) => ({
    type: ADD_DEAL_SETTINGS,
    payload: settings,
});


export const loadClonePipelineList = (dealId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: CLONE_PIPELINES_LOADING, payload: true });
            dispatch({ type: CLEAR_CLONE });
            
            const response = await getDealClonePipelines(dealId);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addClonePipeline(list));
            }

            dispatch({ type: CLONE_PIPELINES_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: CLONE_PIPELINES_LOADING, payload: false });
        }
    };
};

export const addClonePipeline = (list) => ({
    type: AVAILABLE_CLONE_PIPELINES,
    payload: list,
});

export const loadCloneUserList = (dealId, pipelineId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: CLONE_USERS_LOADING, payload: true });

            const response = await getDealCloneUsers(dealId, pipelineId);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addCloneUsers(list));
            }

            dispatch({ type: CLONE_USERS_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: CLONE_USERS_LOADING, payload: false });
        }
    };
};

export const addCloneUsers = (list) => ({
    type: AVAILABLE_CLONE_USERS,
    payload: list,
});

export const cloneDeal = (dealId, cloneData) => {
    return async (dispatch) => {
        try {
            dispatch({ type: CLONE_ACTION_SAVE_LOADING, payload: true });

            const response = await setCloneDeal(dealId, { pipeline_id: cloneData?.pipeline?.value, owner_id: cloneData?.owner?.value });
            if (response.httpCode === 200) {
                const data = response.data;
                dispatch(addCloneUsers(data));

                notificationService.success('Deal Cloned!');
            }

            dispatch({ type: CLONE_ACTION_SAVE_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: CLONE_ACTION_SAVE_LOADING, payload: false });
        }
    };
};

export const changeDealInternalReference = (dealId, internalReferenceId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: true });
            const response = await updateDeal(dealId, {internal_reference_id: internalReferenceId});
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
                notificationService.success('Deal internal reference updated!');
                return true
            }

            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            notificationService.error('Something went wrong!');
            return false;
        } catch (error) {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            notificationService.error('Something went wrong!');
            return false;
        }
    }
}

export const changeDealExpectedCloseDate = (dealId, closeDate) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: true });

            const response = await updateDeal(dealId, {expected_close_date : closeDate});
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
                notificationService.success('Deal expected close date updated!');
                return true
            }

            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            notificationService.error('Something went wrong!');
            return false;
        } catch (error) {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
        }
    };
};

export const changeDealSharedUsers = (dealId, userIds) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: true });

            const response = await updateDeal(dealId, {users : userIds});
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
                notificationService.success('Deal users updated!');
                return true
            }

            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            notificationService.error('Something went wrong!');
            return false;
        } catch (error) {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
        }
    };
};

export const changeDealStatus = (data) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: true });

            const response = await updateDealStatus(data);
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                notificationService.success('Status updated!');
            }

            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            return true;
        } catch (error) {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            return false;
        }
    };
};

export const associateDealOwner = (ownerId, dealId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: true });
            const response = await updateDealOwner({deal_id: dealId, owner_id: ownerId});
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                notificationService.success('Owner updated!');
            }

            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            return true;
        } catch (error) {
            dispatch({ type: DEAL_ACTION_SAVE_LOADING, payload: false });
            return false;
        }
    };
};

export const associateDealContact = (contactId, dealId) => {
    return async (dispatch) => {
        try {
            const response = await updateDealContact({deal_id: dealId, contact_id: contactId});
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                notificationService.success('Client added with the deal!');

                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    };
};

export const changeStage = (dealId, stageId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_SET_SAVE_LOADING, payload: true });
            dispatch({ type: PROCESSING_STAGE, payload: stageId });

            const response = await updateDealStage({deal_id: dealId, stage_id: stageId});
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                dispatch({ type: DEAL_SET_SAVE_LOADING, payload: false });
                dispatch({ type: PROCESSING_STAGE, payload: false });

                notificationService.success('Stage updated!');
            }
        } catch (error) {
            dispatch({ type: DEAL_SET_SAVE_LOADING, payload: false });
            dispatch({ type: PROCESSING_STAGE, payload: false });
            
            notificationService.error('Failed to change stage');
        }
    };
};

export const fetchDealList = (queryParams, condition) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_LIST_LOADING, payload: true });
            const response = await getDealList(queryParams, condition);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addDealList(list));
            }
            dispatch({ type: DEAL_LIST_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: DEAL_LIST_LOADING, payload: false });
            console.error("Failed to fetch pipeline:", error);
        }
    };
};

export const fetchDeal = (id) => {
    return async (dispatch) => {
        try {
            dispatch({type: BILL_INITIALIZED, payload: false})
            const response = await getDeal(id);
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));
            }
            dispatch({type: BILL_INITIALIZED, payload: true})
        } catch (error) {
            console.error("Failed to fetch deal:", error);
            dispatch({type: BILL_INITIALIZED, payload: true})
        }
    };
};

export const saveDeal = (deal) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DEAL_SET_SAVE_LOADING, payload: true });

            let response;
            if (!deal.id) {
                response = await createDeal(deal);
            } else {
                const updatedDeal = {
                    id: deal?.id,
                    name: deal?.name,
                    temp_custom_fields: deal?.temp_custom_fields
                }
                response = await updateDeal(deal.id, updatedDeal);
            }

            if (response.httpCode === 200) {
                dispatch(addDeal(response.data));
                notificationService.success( (!deal.id) ? 'Deal created!' : 'Deal updated!');
            }
            dispatch({ type: DEAL_SET_SAVE_LOADING, payload: false });

            return response;
        } catch (error) {
            console.error("Failed to save deal:", error);
            
            dispatch({ type: DEAL_SET_SAVE_LOADING, payload: false });
            notificationService.error('Failed to save deal');
        }
    };
};

export const detachDealContact = (dealId) => {
    return async (dispatch) => {
        try {
            const response = await remomveDealContact(dealId)
            if (response.httpCode === 200) {
                const deal = response.data;
                dispatch(addDeal(deal));

                return true;
            }

            return false;
        } catch (error) {
            console.error("Failed to detach contact:", error);
            notificationService.error('Failed to detach contact');

            return false;
        }
    };
};

export const handleDealChange = (field, value) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_DEAL,
            payload: { [field]: value }
        });
    }
};



export const changeExpectedCloseDate = (date) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_EXPECTED_CLOSE_DATE, payload: date });
    }
}

export const addDealList = (list) => ({
    type: ADD_DEAL_LIST,
    payload: list,
});

export const addDeal = (deal) => ({
    type: ADD_DEAL,
    payload: deal,
});

export const bulkDeleteDeal = (bulkIds) => {
    return async (dispatch) => {
        try {
            dispatch({ type: BULK_DEAL_ACTION_LOADING, payload: true });
            // const response = await deletePayment(bulkIds);
            // if (response.httpCode === 200) {
            //      dispatch({ type: SET_BULK_DEAL_IDS, payload: [] });
            //      return true;
            // }
            return false
        } catch (error) {
            dispatch({ type: BULK_DEAL_ACTION_LOADING, payload: false });
            return false;
        }
    }
}

export const setBulkDealIds = (bulkIds) => {
    return async (dispatch) => {
        dispatch({ type: SET_BULK_DEAL_IDS, payload: bulkIds });
    }
}






















import { createFilterCondition } from "../../service/FilterService";

export const ADD_DEAL_CONDITION                  = 'ADD_DEAL_CONDITION';
export const CHANGE_DEAL_CONDITION               = 'CHANGE_DEAL_CONDITION';
export const UPDATE_DEAL_CONDITION_RULE          = 'UPDATE_DEAL_CONDITION_RULE';
export const UPDATE_DEAL_CONDITION_VALUE         = 'UPDATE_DEAL_CONDITION_VALUE';
export const REMOVE_DEAL_CONDITION               = 'REMOVE_DEAL_CONDITION';
export const DEAL_CONDITION_SET_SAVE_LOADING     = 'DEAL_CONDITION_SET_SAVE_LOADING';

import { SET_DEFAULT_FILTER } from "../filter/action";
export const SET_DEAL_DEFAULT_FILTER             = 'SET_DEAL_DEFAULT_FILTER';

export const UPDATE_DEAL_FILTER_LIST             = 'UPDATE_DEAL_FILTER_LIST';

export const setDealDefaultFilter = (data) => {
    return async (dispatch) => {
        try {
            await dispatch({ type: SET_DEFAULT_FILTER, payload: data });
            await dispatch({ type: SET_DEAL_DEFAULT_FILTER, payload: data });
        } catch (error) {
            console.log('clear default filter error')
        }
    }
}


export const changeDealCondition = (condition) => ({
    type: CHANGE_DEAL_CONDITION,
    payload: condition
});

export const addNewDealCondition = (rule) => ({
    type: ADD_DEAL_CONDITION,
    payload: rule
});

export const updateDealOptionRule = (index, data) => ({
    type: UPDATE_DEAL_CONDITION_RULE,
    payload: { index, data }
});

export const updateDealOptionValue = (index, value) => ({
    type: UPDATE_DEAL_CONDITION_VALUE,
    payload: {index, value}
});

export const removeDealCondition = (index) => ({
    type: REMOVE_DEAL_CONDITION,
    payload: index
});

export const saveDealFilterCondition = (dealFilter) => {
    return async (dispatch) => {
        try {
            dispatch({type: DEAL_CONDITION_SET_SAVE_LOADING, payload: true})

            const response = await createFilterCondition(dealFilter);
            if (response.httpCode === 200) {
                dispatch({type: UPDATE_DEAL_FILTER_LIST, payload: response?.data?.filters})
            }

            dispatch({type: DEAL_CONDITION_SET_SAVE_LOADING, payload: false})
            return response;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            dispatch({type: DEAL_CONDITION_SET_SAVE_LOADING, payload: false})
            notificationService.error('Failed to save filter');
        }
    };
};
