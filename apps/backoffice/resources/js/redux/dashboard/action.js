import { getDashboardStats, getClientDealStats, getStatsCreatedVsClosed, getStatsByCreatedDate } from "../../service/DashboardService";

export const DASHBOARD_STATS_LOADING  = 'DASHBOARD_STATS_LOADING';
export const ADD_DASHBOARD_STATS      = 'ADD_DASHBOARD_STATS';

export const DASHBOARD_CLIENT_DEAL_STATS_LOADING  = 'DASHBOARD_CLIENT_DEAL_STATS_LOADING';
export const ADD_DASHBOARD_CLIENT_DEAL_STATS      = 'ADD_DASHBOARD_CLIENT_DEAL_STATS';

export const DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING  = 'DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING';
export const ADD_DASHBOARD_CREATED_VS_CLOSED_STATS      = 'ADD_DASHBOARD_CREATED_VS_CLOSED_STATS';

export const DASHBOARD_BY_CREATED_DATE_STATS_LOADING  = 'DASHBOARD_BY_CREATED_DATE_STATS_LOADING';
export const ADD_DASHBOARD_BY_CREATED_DATE_STATS      = 'ADD_DASHBOARD_BY_CREATED_DATE_STATS';

export const addDashboardStats = (data) => ({
    type: ADD_DASHBOARD_STATS,
    payload: data,
});

export const addDashboardClientDealStats = (data) => ({
    type: ADD_DASHBOARD_CLIENT_DEAL_STATS,
    payload: data,
});

export const addDashboardCreatedVsClosedStats = (data) => ({
    type: ADD_DASHBOARD_CREATED_VS_CLOSED_STATS,
    payload: data,
});

export const addDashboardByCreatedDateStats = (data) => ({
    type: ADD_DASHBOARD_BY_CREATED_DATE_STATS,
    payload: data,
});

export const loadDashboardStats = (params) => {

    return async (dispatch) => {
        try {
            dispatch({ type: DASHBOARD_STATS_LOADING, payload: true });
            const response = await getDashboardStats(params);
            if (response.httpCode === 200) {
                dispatch(addDashboardStats(response?.data));
            }
            dispatch({ type: DASHBOARD_STATS_LOADING, payload: false });
        } catch(error) {
            console.log('Getting dashboard stats error!')
            dispatch({ type: DASHBOARD_STATS_LOADING, payload: false });
        }
    }
}

export const loadClientDealStats = (params) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DASHBOARD_CLIENT_DEAL_STATS_LOADING, payload: true });
            const response = await getClientDealStats(params);
            if (response.httpCode === 200) {
                dispatch(addDashboardClientDealStats(response?.data));
            }
            dispatch({ type: DASHBOARD_CLIENT_DEAL_STATS_LOADING, payload: false });
        } catch(error) {
            console.log('Getting dashboard client deal stats error!')
            dispatch({ type: DASHBOARD_CLIENT_DEAL_STATS_LOADING, payload: false });
        }
    }
}


export const loadDashboardCreatedVsClosedStats = (params) => {

    return async (dispatch) => {
        try {
            dispatch({ type: DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING, payload: true });
            const response = await getStatsCreatedVsClosed(params);
            if (response.httpCode === 200) {
                dispatch(addDashboardCreatedVsClosedStats(response?.data));
            }
            dispatch({ type: DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING, payload: false });
        } catch(error) {
            console.log('Getting dashboard stats error!')
            dispatch({ type: DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING, payload: false });
        }
    }
}

export const loadByCreatedDateStats = (params) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DASHBOARD_BY_CREATED_DATE_STATS_LOADING, payload: true });
            const response = await getStatsByCreatedDate(params);
            if (response.httpCode === 200) {
                dispatch(addDashboardByCreatedDateStats(response?.data));
            }
            dispatch({ type: DASHBOARD_BY_CREATED_DATE_STATS_LOADING, payload: false });
        } catch(error) {
            console.log('Getting dashboard stats error!')
            dispatch({ type: DASHBOARD_BY_CREATED_DATE_STATS_LOADING, payload: false });
        }
    }
}