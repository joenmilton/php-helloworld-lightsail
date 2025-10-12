import { PIPELINE_SET_SAVE_LOADING } from "../common/action";
import { 
  ADD_PIPELINE, CLEAR_PIPELINE, UPDATE_STAGE, ADD_STAGE, REMOVE_STAGE,
  ADD_PIPELINE_LIST, ADD_DEPENDENTS_LIST
} from './action';

const initialState = {
  saveLoading: false,
  deal: {
    listPipeline: [],
    pipeline: {
      id: '',
      name: '',
      stages: [],
      visibility_group: null
    },
  }
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case PIPELINE_SET_SAVE_LOADING:
      return {
        ...state,
        saveLoading: action.payload,
      };
    case ADD_PIPELINE_LIST:
      return {
        ...state,
        deal: {
          ...state.deal,
          listPipeline: action.payload
        }
      };
    case ADD_PIPELINE:
      return {
        ...state,
        deal: {
          ...state.deal,
          pipeline: action.payload
        }
      };
    case UPDATE_STAGE:
      const updatedStages = [...state.deal.pipeline.stages];
      updatedStages[action.payload.index] = action.payload.stage;
      return {
        ...state,
        deal: {
          ...state.deal,
          pipeline: {
            ...state.deal.pipeline,
            stages: updatedStages,
          },
        },
      };
    case ADD_STAGE:
      return {
        ...state,
        deal: {
          ...state.deal,
          pipeline: {
            ...state.deal.pipeline,
            stages: [
              ...state.deal.pipeline.stages,
              { id: '', name: '', sort_order: state.deal.pipeline.stages.length + 1 },
            ],
          },
        },
      };

    case REMOVE_STAGE:
      const filteredStages = state.deal.pipeline.stages.filter((_, index) => index !== action.payload);
      return {
        ...state,
        deal: {
          ...state.deal,
          pipeline: {
            ...state.deal.pipeline,
            stages: filteredStages,
          },
        },
      };

    case CLEAR_PIPELINE:
      return {
        ...state,
        deal: action.payload
      };
      
    case ADD_DEPENDENTS_LIST:
      return {
        ...state,
        deal: {
          ...state.deal,
          pipeline: {
            ...state.deal.pipeline,
            visibility_group: {
              ...state.deal.pipeline.visibility_group,
              dependents: action.payload.list,
              type: action.payload.type
            }
          }
        }
      }; 

    default:
      return state;
  }
};

export default settingsReducer;
