import { combineReducers } from "redux";
import commonReducer from "./common/reducer";
import settingsReducer from "./settings/reducer";
import dealReducer from "./deals/reducer";
import activityReducer from "./activity/reducer";
import adminReducer from "./admin/reducer";
import roleReducer from "./role/reducer";
import teamReducer from "./team/reducer";
import bankReducer from "./bank/reducer";
import contactReducer from "./contact/reducer";
import productReducer from "./product/reducer";
import billableReducer from "./billable/reducer";
import paymentReducer from "./payment/reducer";
import journalReducer from "./journal/reducer";
import timelineReducer from "./timeline/reducer";
import kanbanReducer from "./kanban/reducer";
import filterReducer from "./filter/reducer";
import notificationReducer from "./notification/reducer";
import reportReducer from "./report/reducer";
import dashboardReducer from "./dashboard/reducer";

const rootReducer = combineReducers({
    common: commonReducer,
    settings: settingsReducer,
    deal: dealReducer,
    activity: activityReducer,
    admin: adminReducer,
    role: roleReducer,
    team: teamReducer,
    bank: bankReducer,
    contact: contactReducer,
    product: productReducer,
    billable: billableReducer,
    payment: paymentReducer,
    journal: journalReducer,
    timeline: timelineReducer,
    kanban: kanbanReducer,
    filter: filterReducer,
    report: reportReducer,
    dashboard: dashboardReducer,
    notification: notificationReducer,
})

export default rootReducer;