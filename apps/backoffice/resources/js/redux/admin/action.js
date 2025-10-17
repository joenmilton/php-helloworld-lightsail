import { getAdminList, createAdmin, updateAdmin } from "../../service/AdminService";
import notificationService from "../../service/NotificationService";


export const RESET_ADMIN_DETAIL         = 'RESET_ADMIN_DETAIL';
export const UPDATE_ACTIVE_TAB          = 'UPDATE_ACTIVE_TAB';
export const ADD_ADMIN                  = 'ADD_ADMIN';
export const ADD_ADMIN_LIST             = 'ADD_ADMIN_LIST';
export const ADMIN_SET_SAVE_LOADING     = 'ADMIN_SET_SAVE_LOADING';

export const changeActiveTab = (type) => {
    return (dispatch) => {
        dispatch({type: UPDATE_ACTIVE_TAB, payload: type})
    }
};

export const fetchAdminList = (page, perPage) => {
    return async (dispatch) => {
        try {
            const response = await getAdminList(page, perPage);
            if (response.httpCode === 200) {
              const list = response.data;
              dispatch(addAdminList(list));
            }
        } catch (error) {
            console.error("Failed to fetch admin:", error);
        }
    };
};

export const saveAdmin = (admin) => {
    return async (dispatch) => {
        try {
            dispatch({ type: ADMIN_SET_SAVE_LOADING, payload: true });

            let response;
            if (!admin.id) {
                response = await createAdmin(admin);
            } else {
                response = await updateAdmin(admin.id, admin);
            }

            if (response.httpCode === 200) {
                const list = response.data
                dispatch(addAdminList(list));
                dispatch(resetAdmin());
                
                notificationService.success( (!admin.id) ? 'User created!' : 'User updated!');
            }
            dispatch({ type: ADMIN_SET_SAVE_LOADING, payload: false });

            return response;
        } catch (error) {
            console.error("Failed to save User:", error);
            
            dispatch({ type: ADMIN_SET_SAVE_LOADING, payload: false });
            notificationService.error('Failed to save User');
        }
    };
};


export const addAdmin = (admin) => ({
    type: ADD_ADMIN,
    payload: admin,
});

export const addAdminList = (list) => ({
    type: ADD_ADMIN_LIST,
    payload: list,
});

export const resetAdmin = () => ({
    type: RESET_ADMIN_DETAIL,
    payload: {
        id: '',
        name: '',
        email: '',
        password:'',
        password_confirmation: '',
        is_superadmin: 0,
        role_id: false,
    },
});
