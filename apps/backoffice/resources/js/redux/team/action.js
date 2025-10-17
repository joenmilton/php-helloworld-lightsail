import { getTeamList, createTeam, updateTeam } from "../../service/TeamService";
import notificationService from "../../service/NotificationService";


export const RESET_TEAM_DETAIL         = 'RESET_TEAM_DETAIL';
export const UPDATE_ACTIVE_TAB          = 'UPDATE_ACTIVE_TAB';
export const ADD_TEAM                  = 'ADD_TEAM';
export const ADD_TEAM_LIST             = 'ADD_TEAM_LIST';
export const TEAM_SET_SAVE_LOADING     = 'TEAM_SET_SAVE_LOADING';

export const changeActiveTab = (type) => {
    return (dispatch) => {
        dispatch({type: UPDATE_ACTIVE_TAB, payload: type})
    }
};

export const fetchTeamList = (page, perPage) => {
    return async (dispatch) => {
        try {
            const response = await getTeamList(page, perPage);
            if (response.httpCode === 200) {
              const list = response.data;
              dispatch(addTeamList(list));
            }
        } catch (error) {
            console.error("Failed to fetch team:", error);
        }
    };
};

export const saveTeam = (team) => {
    return async (dispatch) => {
        try {
            dispatch({ type: TEAM_SET_SAVE_LOADING, payload: true });

            let response;
            if (!team.id) {
                response = await createTeam(team);
            } else {
                response = await updateTeam(team.id, team);
            }

            if (response.httpCode === 200) {
                const list = response.data
                dispatch(addTeamList(list));
                dispatch(resetTeam());
                
                notificationService.success( (!team.id) ? 'User created!' : 'User updated!');
            }
            dispatch({ type: TEAM_SET_SAVE_LOADING, payload: false });

            return response;
        } catch (error) {
            console.error("Failed to save User:", error);
            
            dispatch({ type: TEAM_SET_SAVE_LOADING, payload: false });
            notificationService.error('Failed to save User');
        }
    };
};


export const addTeam = (team) => ({
    type: ADD_TEAM,
    payload: team,
});

export const addTeamList = (list) => ({
    type: ADD_TEAM_LIST,
    payload: list,
});

export const resetTeam = () => ({
    type: RESET_TEAM_DETAIL,
    payload: {
        id: '',
        name: '',
        description: '',
        members: []
    },
});
