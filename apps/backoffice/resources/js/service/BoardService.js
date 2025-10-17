import api from "./api";

export const getBoardData = async (pipelineId) => {
    try {
        const response = await api.get(`/admin/pipeline/${pipelineId}/board`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateBoardSorting = async (pipelineId, data) => {
    try {
        const response = await api.post(`/admin/pipeline/${pipelineId}/board`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
