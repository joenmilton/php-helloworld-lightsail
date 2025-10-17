import { createFilterCondition } from "../../service/FilterService";
import notificationService from "../../service/NotificationService";

export const ADD_CONDITION                  = 'ADD_CONDITION';
export const CHANGE_CONDITION               = 'CHANGE_CONDITION';
export const UPDATE_CONDITION_RULE          = 'UPDATE_CONDITION_RULE';
export const UPDATE_CONDITION_VALUE         = 'UPDATE_CONDITION_VALUE';
export const REMOVE_CONDITION               = 'REMOVE_CONDITION';
export const CONDITION_SET_SAVE_LOADING     = 'CONDITION_SET_SAVE_LOADING';
export const SET_DEFAULT_FILTER             = 'SET_DEFAULT_FILTER';

export const UPDATE_FILTER_LIST             = 'UPDATE_FILTER_LIST';

export const setDefaultFilter = (data) => {
    return async (dispatch) => {
        try {
            await dispatch({ type: SET_DEFAULT_FILTER, payload: data });
        } catch (error) {
            console.log('clear default filter error')
        }
    }
}


export const changeCondition = (condition) => ({
    type: CHANGE_CONDITION,
    payload: condition
});

export const addNewCondition = (rule) => ({
    type: ADD_CONDITION,
    payload: rule
});

export const updateOptionRule = (index, data) => ({
    type: UPDATE_CONDITION_RULE,
    payload: { index, data }
});

export const updateOptionValue = (index, value) => ({
    type: UPDATE_CONDITION_VALUE,
    payload: {index, value}
});

export const removeCondition = (index) => ({
    type: REMOVE_CONDITION,
    payload: index
});

export const saveFilterCondition = (dealFilter) => {
    return async (dispatch) => {
        try {
            dispatch({type: CONDITION_SET_SAVE_LOADING, payload: true})

            const response = await createFilterCondition(dealFilter);
            if (response.httpCode === 200) {
                dispatch({type: UPDATE_FILTER_LIST, payload: response?.data?.filters})
            }

            dispatch({type: CONDITION_SET_SAVE_LOADING, payload: false})
            return response;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            dispatch({type: CONDITION_SET_SAVE_LOADING, payload: false})
            notificationService.error('Failed to save filter');
        }


        // try {
        //     if(!dealFilter?.save_filter) {
        //         return dealFilter;
        //     }
            
        //     dispatch({type: CONDITION_SET_SAVE_LOADING, payload: true})
        //     const response = await createFilterCondition(dealFilter);
        //     if (response.httpCode === 200) {
        //         const filtersData = response.data;
                
        //         dispatch({type: UPDATE_FILTER_LIST, payload: filtersData.filters})
        //         dispatch({type: CONDITION_SET_SAVE_LOADING, payload: false})

        //         return filtersData.filters.find(f => f.id === filtersData.active_id);
        //     }

        //     dispatch({type: CONDITION_SET_SAVE_LOADING, payload: false})
        //     return false;
        // } catch (error) {
        //     console.error("Failed to fetch products:", error);
        //     dispatch({type: CONDITION_SET_SAVE_LOADING, payload: false})
        // }
    };
};
