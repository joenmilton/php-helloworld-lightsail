import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation } from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import PropTypes from "prop-types";
import Layout from "./components/Layout/Layout";

import Dashboard from './pages/admin/dashboard';
import ViewDeal from './pages/admin/deals/view';
import BoardDeal from './pages/admin/deals/board';
import ListDeal from './pages/admin/deals';
import ListActivity from './pages/admin/activity';
import ListPayment from './pages/admin/payment';
import ListProduct from './pages/admin/products';

import DealSettings from './pages/admin/settings/deals';
import UserSettings from './pages/admin/settings/users';
import BankSettings from './pages/admin/settings/banks';
import RoleSettings from './pages/admin/settings/roles';
import TeamSettings from './pages/admin/settings/teams';
import EditPipeline from './pages/admin/pipeline/edit';
import PipelineBoard from './pages/admin/pipeline/board';
import PublicationProcess from './pages/admin/journal/sheet/PublicationProcess';

import GeneralSettings from './pages/admin/settings/general';
import SettingsNavigation from "./pages/admin/settings/SettingsNavigation";

import DealStatusReport from './pages/admin/report/detailed_report/deal_status';

import { fetchSettings } from './redux/common/action';
import { useHasPermission } from './utils/permissions';

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.common.isLoading);

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const ProtectedRoute = ({ permissions, component: Component, ...rest }) => {
        // Check if user has permissions
        const hasPermission = useHasPermission(permissions);
    
        return (
            <Route
                {...rest}
                render={(props) =>
                    isLoading ? ( // Show loading indicator if still fetching
                        <div>Loading...</div>
                    ) : hasPermission ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to="/admin/not-authorized" />
                    )
                }
            />
        );
    };

    return (
        <div className="App">
            <Router>
                <Sidebar />
                <Switch>
                    <Layout>
                        <ProtectedRoute
                            path="/admin/home"
                            component={Dashboard}
                            permissions={["view own deals"]} 
                        />
                        <ProtectedRoute 
                            path="/admin/deals/board" 
                            component={BoardDeal} 
                            permissions={["view all deals", "view team deals", "view own deals"]} 
                        />
                        <ProtectedRoute 
                            path="/admin/deals/:dealId/edit" 
                            component={ViewDeal} 
                            permissions={["view all deals", "view team deals", "view own deals"]} 
                        />
                        <ProtectedRoute
                            exact
                            path="/admin/deals"
                            component={ListDeal}
                            permissions={["view all deals", "view team deals", "view own deals"]}
                        />
                        <ProtectedRoute
                            path="/admin/activity"
                            component={ListActivity}
                            permissions={["view all activities", "view own activities", "view deal activities"]}
                        />
                        <ProtectedRoute 
                            path="/admin/payments" 
                            component={ListPayment} 
                            permissions={["view payments"]} 
                        />
                        <ProtectedRoute 
                            path="/admin/products" 
                            component={ListProduct} 
                            permissions={["view products"]} 
                        />
                        <ProtectedRoute 
                            path="/admin/pipeline/:pipelineId/board" 
                            component={PipelineBoard} 
                            permissions={["view all deals", "view team deals", "view own deals"]} 
                        />
                        <ProtectedRoute 
                            path="/admin/sheet/process" 
                            component={PublicationProcess} 
                            permissions={["view publication sheet"]} 
                        />

                        <ProtectedRoute 
                            path="/admin/report/detailed-report/deal-status-report" 
                            component={DealStatusReport} 
                            permissions={["deal status report"]} 
                        />

                        <ProtectedRoute 
                            path="/admin/settings"
                            component={({ location }) => (
                                <SettingsNavigation currentPath={location.pathname}>
                                    <Switch>
                                        <ProtectedRoute path="/admin/settings/general" component={GeneralSettings} permissions={["update settings"]}/>
                                        <ProtectedRoute path="/admin/settings/deals/pipeline/:pipelineId/edit" component={EditPipeline} permissions={["update deal settings"]} />
                                        <ProtectedRoute path="/admin/settings/deals" component={DealSettings} permissions={["update deal settings"]} />

                                        <ProtectedRoute path="/admin/settings/users/roles" component={RoleSettings} permissions={["update role settings"]} />
                                        <ProtectedRoute path="/admin/settings/users/teams" component={TeamSettings} permissions={["update team settings"]} />
                                        <ProtectedRoute path="/admin/settings/users" component={UserSettings} permissions={["update user settings"]} />

                                        <ProtectedRoute path="/admin/settings/banks" component={BankSettings} permissions={["update bank settings"]} />
                                    </Switch>
                                </SettingsNavigation>
                            )}
                            permissions={["update settings", "update deal settings", "update user settings", "update role settings", "update team settings", "update bank settings"]}
                        />
                    </Layout>
                </Switch>
            </Router>
        </div>
    );
}

// `RequireAuth` ensures user is authenticated
const RequireAuth = ({ children, redirectTo, auth }) => {
    const location = useLocation();
    return auth ? (
        children
    ) : (
        <Redirect to={{ pathname: redirectTo, state: { from: location } }} />
    );
};

// `RedirectIfLoggedIn` prevents authenticated users from accessing login or sign-up
const RedirectIfLoggedIn = ({ children, redirectTo, auth }) => {
    const location = useLocation();

    return auth ? (
        <Redirect to={location.state?.from?.pathname || redirectTo} />
    ) : (
        children
    );
};

// Prop types validation for both components
RequireAuth.propTypes = {
    children: PropTypes.node.isRequired,
    redirectTo: PropTypes.string.isRequired,
    auth: PropTypes.any, // Adjust based on your auth data type
};

RedirectIfLoggedIn.propTypes = {
    children: PropTypes.node.isRequired,
    redirectTo: PropTypes.string.isRequired,
    auth: PropTypes.any, // Adjust based on your auth data type
};

export default App;