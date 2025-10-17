import api from "./api";

export const getBankList = async (page, perPage) => {
    try {
        const response = await api.get(`admin/bank`, {
            params: {
                page: page,
                per_page: perPage
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createBank = async (bank) => {
    try {
        const response = await api.post('admin/bank', bank);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateBank = async (id, bank) => {
    try {
        const response = await api.put(`admin/bank/${id}`, bank);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const updateBankAccountStatus = async (bankId, status) => {
    try {
        const response = await api.post(`admin/bank/${bankId}/status`, {
            status: status
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}