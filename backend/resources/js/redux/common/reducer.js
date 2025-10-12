import { SETTINGS_LOADING, ADD_COMMON_SETTINGS } from "./action";

const initialState = {
    isLoading: true,
    settings: {
        permissions: []
    }
}

const commonReducer = (state = initialState, action) => {
    switch (action.type) {

        case SETTINGS_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case ADD_COMMON_SETTINGS:
            return {
                ...state,
                settings: action.payload
            };
        default:
            return state;
    }
}
export default commonReducer;