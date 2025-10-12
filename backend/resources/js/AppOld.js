import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import NotAuthorized from './pages/NotAuthorized';

import ListDeal from './pages/admin/deals';
import BoardDeal from './pages/admin/deals/board';
import ListPayment from './pages/admin/payment';
import ListProduct from './pages/admin/products';
import ListActivity from './pages/admin/activity';
import ViewDeal from './pages/admin/deals/view';
import DealSettings from './pages/admin/settings/deals';
import UserSettings from './pages/admin/settings/users';
import BankSettings from './pages/admin/settings/banks';
import RoleSettings from './pages/admin/settings/roles';
import TeamSettings from './pages/admin/settings/teams';
import EditPipeline from './pages/admin/pipeline/edit';
import GeneralSettings from './pages/admin/settings/general';
import { fetchSettings } from './redux/common/action';
import PipelineBoard from './pages/admin/pipeline/board';
import { useHasPermission } from './utils/permissions';
import PublicationProcess from './pages/admin/journal/sheet/PublicationProcess';

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.common.isLoading);
  
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const ProtectedRoute = ({ permissions, component: Component, ...rest }) => {
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
    <Router>
      <Sidebar />
      <Switch>

        <ProtectedRoute 
          path="/admin/deals/:dealId/edit" 
          component={ViewDeal} 
          permissions={["view all deals", "view team deals", "view own deals"]} 
        />
        <ProtectedRoute 
          path="/admin/deals/board" 
          component={BoardDeal} 
          permissions={["view all deals", "view team deals", "view own deals"]} 
        />
        <ProtectedRoute 
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

        {/* Protected Settings Routes */}
        <ProtectedRoute 
          path="/admin/settings/general" 
          component={GeneralSettings} 
          permissions={["update settings"]} 
        />
        <ProtectedRoute 
          path="/admin/settings/deals/pipeline/:pipelineId/edit" 
          component={EditPipeline} 
          permissions={["update settings"]} 
        />
        <ProtectedRoute 
          path="/admin/settings/deals" 
          component={DealSettings} 
          permissions={["update settings"]} 
        />
        <ProtectedRoute 
          path="/admin/settings/users/roles" 
          component={RoleSettings} 
          permissions={["update settings"]} 
        />
        <ProtectedRoute 
          path="/admin/settings/users/teams" 
          component={TeamSettings} 
          permissions={["update settings"]} 
        />
        <ProtectedRoute 
          path="/admin/settings/users" 
          component={UserSettings} 
          permissions={["update settings"]} 
        />
        <ProtectedRoute banks
          path="/admin/settings/banks" 
          component={BankSettings} 
          permissions={["update settings"]} 
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

        <Route path="/admin/not-authorized" component={NotAuthorized} />

        <Route path="*">
          <Redirect to="/admin/not-authorized" />
        </Route>

      </Switch>
    </Router>
  );
};

export default App;