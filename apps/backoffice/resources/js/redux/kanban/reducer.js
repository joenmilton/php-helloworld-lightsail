import { UPDATE_BOARD, UPDATE_SHRINK, BOARD_SET_LOADING } from "./action";

const initialState = {
    boardLoading: true,
    board: null
};

const kanbanReducer = (state = initialState, action) => {
    switch (action.type) {
        case BOARD_SET_LOADING:
            return {
                ...state,
                boardLoading: action.payload
            }
        case UPDATE_BOARD:
            return {
                ...state,
                board: action.payload
            }
        case UPDATE_SHRINK:
            const { columnId, flag } = action.payload;
            return {
                ...state,
                board: {
                    ...state.board,
                    columns: {
                        ...state.board.columns,
                        [columnId]: {
                            ...state.board.columns[columnId],
                            shrink: flag
                        }
                    }
                }
            };
        default:
            return state;
    }
}
export default kanbanReducer;