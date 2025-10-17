import api from "./api";


export const getPrmissionGroup = async () => {
    try {
        const response = await api.get(`admin/role/permission_group`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRoleList = async (page, perPage) => {
    try {
        const response = await api.get(`admin/role`, {
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

export const createRole = async (role) => {
    try {
        const response = await api.post('admin/role', role);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateRole = async (id, role) => {
    try {
        const response = await api.put(`admin/role/${id}`, role);
        return response.data;
    } catch (error) {
        throw error;
    }
}