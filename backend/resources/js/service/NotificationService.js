import api from "./api";

const notificationService = {
    success: (message) => {
        window.alertify.success(message);
    },
    error: (message) => {
        window.alertify.error(message);
    },
};
export default notificationService;

export const getNotificationList = async (params) => {
    try {
        const response = await api.get(`admin/notifications/all`, {
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAllNotificationRead = async (params) => {
    try {
        const response = await api.post(`admin/notifications/mark-all-read`);
        return response.data;
    } catch (error) {
        throw error;
    }
}