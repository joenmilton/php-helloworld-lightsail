import api from "./api";

export const listTimeline = async (dealId, filter) => {
    try {
        const response = await api.get(`admin/deals/${dealId}/timeline`, {
            params: filter
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}