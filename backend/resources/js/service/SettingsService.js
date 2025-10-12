import api from "./api";

export const getBankList = async () => {
    try {
        const response = await api.get(`admin/settings`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getSettingsData = async () => {
    try {
        const response = await api.get(`admin/settings`);
        return response.data;
    } catch (error) {
        throw error;
    }
}