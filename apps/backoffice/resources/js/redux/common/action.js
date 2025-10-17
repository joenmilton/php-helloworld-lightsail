export const PIPELINE_SET_SAVE_LOADING  = 'PIPELINE_SET_SAVE_LOADING';
export const DEAL_SET_SAVE_LOADING      = 'DEAL_SET_SAVE_LOADING';
export const ADD_COMMON_SETTINGS        = 'ADD_COMMON_SETTINGS';
export const SETTINGS_LOADING           = 'SETTINGS_LOADING';

import { getSettingsData } from "../../service/SettingsService";

export const fetchSettings = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: SETTINGS_LOADING, payload: true });
            const response = await getSettingsData();
            if (response.httpCode === 200) {
              const list = response.data;
              dispatch(addSettingsData(list));
              dispatch({ type: SETTINGS_LOADING, payload: false });
            }
        } catch (error) {
            console.error("Failed to fetch pipeline:", error);
            dispatch({ type: SETTINGS_LOADING, payload: false });
        }
    };
};

export const addSettingsData = (data) => ({
    type: ADD_COMMON_SETTINGS,
    payload: data,
});