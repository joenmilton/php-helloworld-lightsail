import api from "./api";
import { paramSerialize } from '../utils'

export const getJournalSettings = async (queryParams) => {
    try {
        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/journals/table/settings?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createMasterDomain = async (value) => {
    try {
        const response = await api.post(`admin/journals/domain`, {data: value});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createMasterService = async (value) => {
    try {
        const response = await api.post(`admin/journals/service`, {data: value});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createMasterPublisher = async (value) => {
    try {
        const response = await api.post(`admin/journals/publisher`, {data: value});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createMasterJournal = async (value, publisherId) => {
    try {
        const response = await api.post(`admin/journals/journal`, {data: value, publisher_id: publisherId});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createMasterActivity = async (newActivity) => {
    try {
        const response = await api.post(`admin/journals/activity`, newActivity);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createJournalPaper = async (journal) => {
    try {
        const response = await api.post('admin/journals', journal);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateJournalPaper = async (id, journal) => {
    try {
        const response = await api.put(`admin/journals/${id}`, journal);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createJournalProcessing = async (processingDetail) => {
    try {
        const response = await api.post('admin/journals/processing', processingDetail);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateJournalProcessing = async (id, processingDetail) => {
    try {
        const response = await api.put(`admin/journals/processing/${id}`, processingDetail);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createProcessRevision = async (revisionDetail) => {
    try {
        const response = await api.post('admin/journals/revision', revisionDetail);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProcessRevision = async (id, revisionDetail) => {
    try {
        const response = await api.put(`admin/journals/revision/${id}`, revisionDetail);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createProcessProof = async (proofDetail) => {
    try {
        const response = await api.post('admin/journals/proof', proofDetail);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProcessProof = async (id, proofDetail) => {
    try {
        const response = await api.put(`admin/journals/proof/${id}`, proofDetail);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProcessSheet = async (id, processSheet) => {
    try {
        const response = await api.put(`admin/journals/sheet/${id}`, processSheet);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDealJournalPaperList = async (params) => {
    try {
        const response = await api.get(`admin/journals/deal/${params.dealId}`, {
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getJournalPaperList = async (queryParams, condition) => {
    try {
        const rules = condition?.rules
        const serializedRules = paramSerialize(rules, 'rules');

        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}&${serializedRules}`;

        const response = await api.get(`admin/journals?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}