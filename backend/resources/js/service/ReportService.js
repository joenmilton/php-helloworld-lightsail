import api from "./api";
import { paramSerialize } from '../utils'


export const getDealStatusReport = async (data) => {
    try {
        const response = await api.post(`admin/report/detailed-report/deal-status-report`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPipelineUsers = async (pipeline) => {
    try {
        const response = await api.get(`admin/report/pipeline-users/${pipeline}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}