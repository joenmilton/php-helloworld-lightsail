import api from "./api";
import { paramSerialize } from '../utils'

export const getActivitesSettings = async (queryParams) => {
    try {
        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/activity/table/settings?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const updateQuick = async (data, formType) => {
    try {
        const headers = formType === 'file' ? {
            'Accept': '*',
            'Content-Type': 'multipart/form-data'
        } : {};

        // Make the API call with the conditional headers
        const response = await api.post('admin/activity/quick', data, {
            headers
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getActivity = async (activityId) => {
    try {
        const response = await api.get(`admin/activity/${activityId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getActivityList = async (queryParams, condition) => {
    try {
        const rules = condition?.rules
        const serializedRules = paramSerialize(rules, 'rules');

        const serializedParams = Object.entries(queryParams)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');

        const queryString = `${serializedParams}&${serializedRules}`;

        const response = await api.get(`admin/activity?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const listDealActivity = async (filter) => {
    try {
        const response = await api.get(`admin/activity/deal/${filter.model_id}`, {
            params: filter
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createActivity = async (activity) => {
    try {
        const response = await api.post('admin/activity', activity);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateActivity = async (id, activity) => {
    try {
        const response = await api.put(`admin/activity/${id}`, activity);
        return response.data;
    } catch (error) {
        throw error;
    }
}