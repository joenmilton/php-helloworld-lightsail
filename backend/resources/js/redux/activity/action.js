import { createActivity, updateActivity, getActivityList, getActivity, listDealActivity, getActivitesSettings } from "../../service/ActivityService";

export const SET_ACTIVITY_ACTIVE_CONDITION   = 'SET_ACTIVITY_ACTIVE_CONDITION';

export const ACTIVITY_SETTINGS_LOADING  = 'ACTIVITY_SETTINGS_LOADING';
export const ADD_ACTIVITY_SETTINGS      = 'ADD_ACTIVITY_SETTINGS';
export const ACTIVITY_SET_SAVE_LOADING  = 'ACTIVITY_SET_SAVE_LOADING';
export const ACTIVITY_LOADING           = 'ACTIVITY_LOADING';
export const ADD_ACTIVITY               = 'ADD_ACTIVITY';
export const UPDATE_ACTIVITY            = 'UPDATE_ACTIVITY';
export const ACTIVITY_LIST_LOADING      = 'ACTIVITY_LIST_LOADING';
export const ACTIVITY_DEAL_LIST_LOADING = 'ACTIVITY_DEAL_LIST_LOADING';
export const ADD_DEAL_ACTIVITY_LIST     = 'ADD_DEAL_ACTIVITY_LIST';
export const UPDATE_ACTIVITY_LIST       = 'UPDATE_ACTIVITY_LIST';
export const ADD_SEARCH_LIST            = 'ADD_SEARCH_LIST';
export const SET_LIST_FILTER            = 'SET_LIST_FILTER';
export const ACTIVITY_FORM_FLAG         = 'ACTIVITY_FORM_FLAG';
export const UPDATE_DUE_DATE            = 'UPDATE_DUE_DATE';
export const UPDATE_END_DATE            = 'UPDATE_END_DATE';
export const UPDATE_START_TIME          = 'UPDATE_START_TIME';
export const UPDATE_END_TIME            = 'UPDATE_END_TIME';
export const ACTIVITY_UPDATE_COMMENT    = 'ACTIVITY_UPDATE_COMMENT';
export const ACTIVITY_QUICK_TOGGLE      = 'ACTIVITY_QUICK_TOGGLE';
export const ACTIVITY_DETAIL_QUICK_TOGGLE      = 'ACTIVITY_DETAIL_QUICK_TOGGLE';
export const ACTIVITY_INNER_TOGGLE      = 'ACTIVITY_INNER_TOGGLE';
export const ACTIVITY_DETAIL_INNER_TOGGLE               = 'ACTIVITY_DETAIL_INNER_TOGGLE';

export const ACTIVITY_QUICK_SET_SAVE_LOADING            = 'ACTIVITY_QUICK_SET_SAVE_LOADING';
export const ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING     = 'ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING';

export const ADD_ACTIVITY_LIST                  = 'ADD_ACTIVITY_LIST';
export const UPDATE_ACTIVITY_SORT_ORDER         = 'UPDATE_ACTIVITY_SORT_ORDER';
export const BULK_ACTIVITY_ACTION_LOADING       = 'BULK_ACTIVITY_ACTION_LOADING';
export const SET_BULK_ACTIVITY_IDS              = 'SET_BULK_ACTIVITY_IDS';
export const UPDATE_ACTIVITY_SEARCH_QUERY       = 'UPDATE_ACTIVITY_SEARCH_QUERY';

import { JOURNAL_SETTINGS_RESET } from "../journal/action";

import notificationService from '../../service/NotificationService'
import { updateQuick } from "../../service/ActivityService";

export const updateActivitySearchQuery = (value) => ({
    type: UPDATE_ACTIVITY_SEARCH_QUERY,
    payload: value,
});

export const updateActivityDetail = (detail) => ({
    type: UPDATE_ACTIVITY,
    payload: detail,
});

export const updateActivitySortOrder = (value) => ({
    type: UPDATE_ACTIVITY_SORT_ORDER,
    payload: value,
});

export const fetchActivity = (id) => {
    return async (dispatch) => {
        try {
            dispatch({type: ACTIVITY_LOADING, payload: true})
            const response = await getActivity(id);
            if (response.httpCode === 200) {
                const contact = response.data;
                dispatch(addActivity(contact));
            }
            dispatch({type: ACTIVITY_LOADING, payload: false})
        } catch (error) {
            dispatch({type: ACTIVITY_LOADING, payload: false})
            console.error("Failed to fetch contact:", error);
        }
    };
};

export const loadActivitySettings = (queryParams = {}) => {
    return async (dispatch) => {
        try {
            dispatch({ type: ACTIVITY_SETTINGS_LOADING, payload: true });

            const response = await getActivitesSettings(queryParams);
            if (response.httpCode === 200) {
                const settings = response.data;

                const activeFilter = settings.filters.find(filter => filter.mark_default === true)
                if(activeFilter) {
                    dispatch(setActivityDefaultFilter(activeFilter));
                    dispatch({ type: SET_ACTIVITY_ACTIVE_CONDITION, payload: activeFilter })
                }

                dispatch(addActivitySettings(settings));
            }

            dispatch({ type: ACTIVITY_SETTINGS_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: ACTIVITY_SETTINGS_LOADING, payload: false });
        }
    }
}

export const addActivitySettings = (settings) => ({
    type: ADD_ACTIVITY_SETTINGS,
    payload: settings,
});

export const setInnerToggle = (data) => {
    return async (dispatch) => {
        dispatch({ type: ACTIVITY_INNER_TOGGLE, payload: data });
    }
}

export const setDetailInnerToggle = (data) => {
    return async (dispatch) => {
        dispatch({ type: ACTIVITY_DETAIL_INNER_TOGGLE, payload: data });
    }
}

export const setDetailQuickToggle = (data) => {
    return async (dispatch) => {
        dispatch({ type: ACTIVITY_DETAIL_QUICK_TOGGLE, payload: data });
    }
}
export const setDetailQuickUpdate = (data, formData = false) => {

    return async (dispatch) => {
        const stopLoading = {activity_id: data.activity_id, type: false}

        dispatch({ type: ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING, payload: data });
        try {
            const formType = formData ? 'file' : 'json';
            const response = await updateQuick(formData ? formData : data, formType);
            if (response.httpCode === 200) {
                const result = response.data;
                
                result.forEach(item => {
                    let updatedData = { activity_id: data.activity_id, flag: item.value, key: item.key } 
                    if(updatedData?.key === 'completed') {
                        dispatch({ type: ACTIVITY_DETAIL_QUICK_TOGGLE, payload: { completed: item.value, activity_percentage: item?.activity_percentage } });
                    } else {
                        dispatch({ type: ACTIVITY_DETAIL_QUICK_TOGGLE, payload: updatedData });
                    }
                });
                dispatch({ type: ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING, payload: stopLoading });

                return result;
            }
        } catch (error) {
            console.error("Failed to fetch activities:", error);
            dispatch({ type: ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING, payload: stopLoading });
            return false;
        }
    }
}

export const setQuickToggle = (data) => {
    return async (dispatch) => {
        dispatch({ type: ACTIVITY_QUICK_TOGGLE, payload: data });
    }
}
export const setQuickUpdate = (data, formData = false) => {

    return async (dispatch) => {
        const stopLoading = {activity_id: data.activity_id, type: false}

        dispatch({ type: ACTIVITY_QUICK_SET_SAVE_LOADING, payload: data });
        try {
            const formType = formData ? 'file' : 'json';
            const response = await updateQuick(formData ? formData : data, formType);
            if (response.httpCode === 200) {
                const result = response.data;
                
                result.forEach(item => {
                    let updatedData = { activity_id: data.activity_id, flag: item.value, key: item.key } 
                    dispatch({ type: ACTIVITY_QUICK_TOGGLE, payload: updatedData });
                });
                dispatch({ type: ACTIVITY_QUICK_SET_SAVE_LOADING, payload: stopLoading });

                return result;
            }
        } catch (error) {
            console.error("Failed to fetch activities:", error);
            dispatch({ type: ACTIVITY_QUICK_SET_SAVE_LOADING, payload: stopLoading });
            return false;
        }
    }
}



export const setFilter = (filter) => {
    return async (dispatch) => {
        dispatch({ type: SET_LIST_FILTER, payload: filter });
    }
}

export const fetchActivityList = (queryParams, condition) => {
    return async (dispatch) => {
        try {
            dispatch({ type: ACTIVITY_LIST_LOADING, payload: true });
            const response = await getActivityList(queryParams, condition);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addActivityList(list));
            }
            dispatch({ type: ACTIVITY_LIST_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: ACTIVITY_LIST_LOADING, payload: false });
            console.error("Failed to fetch activities:", error);
        }
    };
}

export const fetchDealActivityList = (filter, type ='fetch') => {
    return async (dispatch) => {
        try {
            
            dispatch(setListLoading(true));
            const response = await listDealActivity(filter);
            if (response.httpCode === 200) {
                const list = response.data;
                if(type === 'fetch') {
                    dispatch(addDealActivityList(list));
                }
                if(type === 'search') {
                    dispatch(updateActivitySearchList(list));
                }

                dispatch(setListLoading(false));
            }
        } catch (error) {
            console.error("Failed to fetch activities:", error);
            dispatch(setListLoading(false));
        }
    };
};

export const saveActivity = (activity) => {
    return async (dispatch) => {
        try {
            dispatch({ type: ACTIVITY_SET_SAVE_LOADING, payload: true });

            let response;
            if (!activity.id) {
                response = await createActivity(activity);
                if (response.httpCode === 200) {
                    dispatch(updateActivityList(response.data))
                    dispatch({ type: JOURNAL_SETTINGS_RESET, payload: false });
                    
                    notificationService.success('Activity created!');
                }
            } else {
                response = await updateActivity(activity.id, activity);
                if (response.httpCode === 200) {
                    dispatch(addActivity(response.data))
                    notificationService.success( 'Activity updated!');
                }
            }

            dispatch({ type: ACTIVITY_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: ACTIVITY_SET_SAVE_LOADING, payload: false });
            
            notificationService.error('Failed to update');
        }
    };
};

export const setListLoading = (flag) => {
    return async (dispatch) => {
        dispatch({ type: ACTIVITY_LIST_LOADING, payload: flag });
    }
}
export const updateActivitySearchList = (data) => ({
    type: ADD_SEARCH_LIST,
    payload: data,
});
export const updateActivityList = (data) => ({
    type: UPDATE_ACTIVITY_LIST,
    payload: data,
});

export const addDealActivityList = (data) => ({
    type: ADD_DEAL_ACTIVITY_LIST,
    payload: data,
});

export const addActivityList = (data) => ({
    type: ADD_ACTIVITY_LIST,
    payload: data,
});

export const addActivity = (data) => ({
    type: ADD_ACTIVITY,
    payload: data,
});
export const changeActivityForm = (flag) => {
    return (dispatch) => {
        const clearData = {
            id: '',
            title: '',
            activity_type_id: '',
            due_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            start_time: '05:00',
            end_time: '23:59',
            reminder_minutes: 30,
            reminder_type: 'minutes',
            owner_id: 1,
            description: '',
            note: '',
            completed: false,
        };

        dispatch(addActivity(clearData));
        dispatch({ type: ACTIVITY_FORM_FLAG, payload: flag });
    }
}
export const updateDueDate = (date) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_DUE_DATE, payload: date });
    }
}
export const updateEndDate = (date) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_END_DATE, payload: date });
    }
}
export const updateStartTime = (time) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_START_TIME, payload: time });
    }
}
export const updateEndTime = (time) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_END_TIME, payload: time });
    }
}

export const bulkDeleteActivity = (bulkIds) => {
    return async (dispatch) => {
        try {
            dispatch({ type: BULK_ACTIVITY_ACTION_LOADING, payload: true });
            const response = await deletePayment(bulkIds);
            if (response.httpCode === 200) {

                dispatch({ type: SET_BULK_PAYMENT_IDS, payload: [] });
                dispatch({ type: BULK_ACTIVITY_ACTION_LOADING, payload: false });
                return true;
            }
            
            dispatch({ type: BULK_ACTIVITY_ACTION_LOADING, payload: false });
            return false
        } catch (error) {
            dispatch({ type: BULK_ACTIVITY_ACTION_LOADING, payload: false });
            return false;
        }
    }
}

export const setBulkActivityIds = (bulkIds) => {
    return async (dispatch) => {
        dispatch({ type: SET_BULK_ACTIVITY_IDS, payload: bulkIds });
    }
}










import { createFilterCondition } from "../../service/FilterService";

export const ADD_ACTIVITY_CONDITION                  = 'ADD_ACTIVITY_CONDITION';
export const CHANGE_ACTIVITY_CONDITION               = 'CHANGE_ACTIVITY_CONDITION';
export const UPDATE_ACTIVITY_CONDITION_RULE          = 'UPDATE_ACTIVITY_CONDITION_RULE';
export const UPDATE_ACTIVITY_CONDITION_VALUE         = 'UPDATE_ACTIVITY_CONDITION_VALUE';
export const REMOVE_ACTIVITY_CONDITION               = 'REMOVE_ACTIVITY_CONDITION';
export const ACTIVITY_CONDITION_SET_SAVE_LOADING     = 'ACTIVITY_CONDITION_SET_SAVE_LOADING';

import { SET_DEFAULT_FILTER } from "../filter/action";
export const SET_ACTIVITY_DEFAULT_FILTER             = 'SET_ACTIVITY_DEFAULT_FILTER';

export const UPDATE_ACTIVITY_FILTER_LIST             = 'UPDATE_ACTIVITY_FILTER_LIST';

export const setActivityDefaultFilter = (data) => {
    return async (dispatch) => {
        try {
            await dispatch({ type: SET_DEFAULT_FILTER, payload: data });
            await dispatch({ type: SET_ACTIVITY_DEFAULT_FILTER, payload: data });
        } catch (error) {
            console.log('clear default filter error')
        }
    }
}


export const changeActivityCondition = (condition) => ({
    type: CHANGE_ACTIVITY_CONDITION,
    payload: condition
});

export const addNewActivityCondition = (rule) => ({
    type: ADD_ACTIVITY_CONDITION,
    payload: rule
});

export const updateActivityOptionRule = (index, data) => ({
    type: UPDATE_ACTIVITY_CONDITION_RULE,
    payload: { index, data }
});

export const updateActivityOptionValue = (index, value) => ({
    type: UPDATE_ACTIVITY_CONDITION_VALUE,
    payload: {index, value}
});

export const removeActivityCondition = (index) => ({
    type: REMOVE_ACTIVITY_CONDITION,
    payload: index
});

export const saveActivityFilterCondition = (activityFilter) => {
    return async (dispatch) => {
        try {
            dispatch({type: ACTIVITY_CONDITION_SET_SAVE_LOADING, payload: true})

            const response = await createFilterCondition(activityFilter);
            if (response.httpCode === 200) {
                dispatch({type: UPDATE_ACTIVITY_FILTER_LIST, payload: response?.data?.filters})
            }

            dispatch({type: ACTIVITY_CONDITION_SET_SAVE_LOADING, payload: false})
            return response;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            dispatch({type: ACTIVITY_CONDITION_SET_SAVE_LOADING, payload: false})
            notificationService.error('Failed to save filter');
        }
    };
};
