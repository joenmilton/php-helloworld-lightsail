import { getPrmissionGroup, getRoleList, createRole, updateRole } from "../../service/RoleService";
import notificationService from "../../service/NotificationService";


export const RESET_ROLE_DETAIL         = 'RESET_ROLE_DETAIL';
export const ADD_ROLE                  = 'ADD_ROLE';
export const ADD_ROLE_LIST             = 'ADD_ROLE_LIST';
export const ROLE_SET_SAVE_LOADING     = 'ROLE_SET_SAVE_LOADING';
export const ADD_PERMISSION_GROUP             = 'ADD_PERMISSION_GROUP';
export const UPDATE_INITIAL_PERMISSION        = 'UPDATE_INITIAL_PERMISSION';


export const updateInitialPermissionSet = (list) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_INITIAL_PERMISSION, payload: list });
    };
};

export const fetchPrmissionGroup = () => {
    return async (dispatch) => {
        try {
            const response = await getPrmissionGroup();
            if (response.httpCode === 200) {
              const list = response.data;
              dispatch({ type: ADD_PERMISSION_GROUP, payload: list });
            }
        } catch (error) {
            console.error("Failed to fetch permission group:", error);
        }
    };
};

export const fetchRoleList = (page, perPage) => {
    return async (dispatch) => {
        try {
            const response = await getRoleList(page, perPage);
            if (response.httpCode === 200) {
              const list = response.data;
              dispatch(addRoleList(list));
            }
        } catch (error) {
            console.error("Failed to fetch admin:", error);
        }
    };
};

export const saveRole = (admin) => {
    return async (dispatch) => {
        try {
            dispatch({ type: ROLE_SET_SAVE_LOADING, payload: true });

            let response;
            if (!admin.id) {
                response = await createRole(admin);
            } else {
                response = await updateRole(admin.id, admin);
            }

            if (response.httpCode === 200) {
                const list = response.data
                dispatch(addRoleList(list));
                // dispatch(resetRole());
                
                notificationService.success( (!admin.id) ? 'Role created!' : 'Role updated!');
            }
            dispatch({ type: ROLE_SET_SAVE_LOADING, payload: false });

            return response;
        } catch (error) {
            console.error("Failed to save User:", error);
            
            dispatch({ type: ROLE_SET_SAVE_LOADING, payload: false });
            notificationService.error('Failed to save User');
        }
    };
};


export const addRole = (admin) => ({
    type: ADD_ROLE,
    payload: admin,
});

export const addRoleList = (list) => ({
    type: ADD_ROLE_LIST,
    payload: list,
});

export const resetRole = () => ({
    type: RESET_ROLE_DETAIL,
    payload: {
        id: '',
        name: '',
        permissions: []
    },
});
