import { 
    DASHBOARD_STATS_LOADING,
    ADD_DASHBOARD_STATS,
    DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING, 
    ADD_DASHBOARD_CREATED_VS_CLOSED_STATS,
    DASHBOARD_BY_CREATED_DATE_STATS_LOADING,
    ADD_DASHBOARD_BY_CREATED_DATE_STATS,
    DASHBOARD_CLIENT_DEAL_STATS_LOADING,
    ADD_DASHBOARD_CLIENT_DEAL_STATS
} from "./action";

const initialState = {
    dashboardStatsLoading: false,
    dashboardStats: [],
    dashboardClientDealStatsLoading: false,
    dashboardClientDealStats: [],
    dashboardCreatedVsClosedStatsLoading: false,
    dashboardCreatedVsClosedStats: [],
    dashboardByCreatedDateStatsLoading: false,
    dashboardByCreatedDateStats: [],
};

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_STATS_LOADING:
            return {
                ...state,
                dashboardStatsLoading: action.payload,
            };
        case ADD_DASHBOARD_STATS:
            return {
                ...state,
                dashboardStats: action.payload,
            };
        case DASHBOARD_CLIENT_DEAL_STATS_LOADING:
            return {
                ...state,
                dashboardClientDealStatsLoading: action.payload,
            };
        case ADD_DASHBOARD_CLIENT_DEAL_STATS:
            return {
                ...state,
                dashboardClientDealStats: action.payload,
            };
        case DASHBOARD_CREATED_VS_CLOSED_STATS_LOADING:
            return {
                ...state,
                dashboardCreatedVsClosedStatsLoading: action.payload,
            };
        case ADD_DASHBOARD_CREATED_VS_CLOSED_STATS:
            return {
                ...state,
                dashboardCreatedVsClosedStats: action.payload,
            };
        case DASHBOARD_BY_CREATED_DATE_STATS_LOADING:
            return {
                ...state,
                dashboardByCreatedDateStatsLoading: action.payload,
            };
        case ADD_DASHBOARD_BY_CREATED_DATE_STATS:
            return {
                ...state,
                dashboardByCreatedDateStats: action.payload,
            };
        default:
            return state;
    }
};
export default dashboardReducer;