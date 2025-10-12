import { getNotificationList, markAllNotificationRead } from "../../service/NotificationService";

export const NOTIFICATION_INITIALIZED       = 'NOTIFICATION_INITIALIZED';
export const ADD_NOTIFICATION_LIST          = 'ADD_NOTIFICATION_LIST';
export const NOTIFICATION_LIST_LOADING      = 'NOTIFICATION_LIST_LOADING';

export const addNotificationList = (list) => ({
    type: ADD_NOTIFICATION_LIST,
    payload: list
});

export const fetchNotificationList = (params) => {
    return async (dispatch) => {
        try {
            dispatch({type: NOTIFICATION_INITIALIZED, payload: false})
            const response = await getNotificationList(params);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addNotificationList(list));
            }
            dispatch({type: NOTIFICATION_INITIALIZED, payload: true})
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            dispatch({type: NOTIFICATION_INITIALIZED, payload: true})
            return null;
        }
    };
};

export const markAllNotification = (params) => {
    return async (dispatch) => {
        try {
            dispatch({type: NOTIFICATION_LIST_LOADING, payload: true});
            const response = await markAllNotificationRead(params);
            
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addNotificationList(list));
            }
            dispatch({type: NOTIFICATION_LIST_LOADING, payload: false});
        } catch (error) {
            console.error("Failed to read notifications:", error);
            dispatch({type: NOTIFICATION_LIST_LOADING, payload: false});
            return null;
        }
    };
};