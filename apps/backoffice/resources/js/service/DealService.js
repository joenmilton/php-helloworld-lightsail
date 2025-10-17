import api from "./api";
import { paramSerialize } from '../utils'

export const setCloneDeal = async (dealId, cloneData) => {
    try {
        const response = await api.post(`admin/deals/${dealId}/clone`, cloneData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDealCloneUsers = async (dealId, pipelineId) => {
    try {
        const response = await api.get(`admin/deals/${dealId}/clone/pipeline/${pipelineId}/users`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDealClonePipelines = async (dealId) => {
    try {
        const response = await api.get(`admin/deals/${dealId}/clone/pipelines`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDeal = async (dealId) => {
    try {
        const response = await api.get(`admin/deals/${dealId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDealList = async (queryParams, condition) => {
    try {
        const rules = condition?.rules
        const serializedRules = paramSerialize(rules, 'rules');

        const serializedParams = Object.entries(queryParams)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');

        const queryString = `${serializedParams}&${serializedRules}`;

        const response = await api.get(`admin/deals?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createDeal = async (deal) => {
    try {
        const response = await api.post('admin/deals', deal);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDeal = async (id, deal) => {
    try {
        const response = await api.put(`admin/deals/${id}`, deal);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDealStage = async (data) => {
    try {
        const response = await api.post(`admin/deals/stage`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDealOwner = async (data) => {
    try {
        const response = await api.post(`admin/deals/owner`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDealContact = async (data) => {
    try {
        const response = await api.post(`admin/deals/contact`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDealJournal = async (data) => {
    try {
        const response = await api.post(`admin/deals/journal`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const remomveDealContact = async (dealId) => {
    try {
        const response = await api.delete(`admin/deals/${dealId}/contact`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDealStatus = async (data) => {
    try {
        const response = await api.post(`admin/deals/status`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getDealSettings = async (queryParams) => {
    try {
        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/deals/table/settings?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatePipelineSettings = async (data) => {
    try {
        const response = await api.post(`admin/deals/table/settings`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getDealPaymentList = async (params) => {
    try {
        const response = await api.get(`admin/payments/deal/${params.dealId}`, {
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}