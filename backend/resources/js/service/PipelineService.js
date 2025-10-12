import api from "./api";

export const getPipelineList = async () => {
    try {
        const response = await api.get(`admin/pipeline`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPipeline = async (pipelineId) => {
    try {
        const response = await api.get(`admin/pipeline/${pipelineId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createPipeline = async (data) => {
    try {
        const response = await api.post('admin/pipeline', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatePipeline = async (id, data) => {
    try {
        const response = await api.put(`admin/pipeline/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}