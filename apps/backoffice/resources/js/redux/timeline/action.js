
import { listTimeline } from "../../service/TimelineService";

export const TIMELINE_LIST_LOADING          = 'TIMELINE_LIST_LOADING';
export const ADD_TIMELINE_LIST              = 'ADD_TIMELINE_LIST';
export const SET_TIMELINE_LIST_FILTER       = 'SET_TIMELINE_LIST_FILTER';


export const fetchTimeline = (dealId, filter) => {
    return async (dispatch) => {
        try {
            
            dispatch(setListLoading(true));

            const response = await listTimeline(dealId, filter);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addTimelineList({
                    ...list,
                    fresh: filter.fresh
                }));
                dispatch(setListLoading(false));
            }
        } catch (error) {
            console.error("Failed to fetch timeline:", error);
            dispatch(setListLoading(false));
        }
    };
};

export const setTimelineFilter = (filter) => {
    return async (dispatch) => {
        dispatch({ type: SET_TIMELINE_LIST_FILTER, payload: filter });
    }
}

export const setListLoading = (flag) => {
    return async (dispatch) => {
        dispatch({ type: TIMELINE_LIST_LOADING, payload: flag });
    }
}

export const addTimelineList = (data) => ({
    type: ADD_TIMELINE_LIST,
    payload: data,
});