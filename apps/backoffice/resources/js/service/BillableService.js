import api from "./api";

export const getBillable = async (dealId) => {
    try {
        const response = await api.get(`admin/deals/${dealId}/billable`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createBillable = async (dealId, bill) => {
    try {
        const response = await api.post(`admin/deals/${dealId}/billable`, bill);
        return response.data;
    } catch (error) {
        throw error;
    }
}