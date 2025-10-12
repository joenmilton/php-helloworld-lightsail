import api from "./api";

export const getAdminList = async (page, perPage) => {
    try {
        const response = await api.get(`admin/admin`, {
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

export const createAdmin = async (admin) => {
    try {
        const response = await api.post('admin/admin', admin);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAdmin = async (id, admin) => {
    try {
        const response = await api.put(`admin/admin/${id}`, admin);
        return response.data;
    } catch (error) {
        throw error;
    }
}


