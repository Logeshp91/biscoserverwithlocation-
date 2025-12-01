import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
export const navigationRef = React.createRef();
import Login from '../LoginModule/Loginscreen/Login';
import Loading from '../LoginModule/Loadingscreens/Loading';
import TabNavigation from './TabNavigation';
import DrawerNavigation from './DrawerNavigation';
import CreateCustomer from '../DashboardModule/dashboardbuttons/VisitTabs/CreateCustomer';
import CreateVisit from '../DashboardModule/dashboardbuttons/VisitTabs/CreateVisit';
import Stage1 from '../DashboardModule/Visitbillingforms/Stage1';
import Stage2 from '../DashboardModule/Visitbillingforms/Stage2';
import VisitListTab from '../DashboardModule/dashboardbuttons/VisitTabs/VisitListTab';
import Outstanding from '../DashboardModule/dashboardbuttons/Outstanding/Outstanding';
import ApprovedList from '../DashboardModule/dashboardbuttons/VisitTabs/ApprovedList';
import ProductList from '../DashboardModule/Visitbillingforms/ProductList';
import VisitSoBillSummary from '../DashboardModule/dashboardbuttons/salesOrder/VisitSoBillSummary';
import Deliveries from '../DashboardModule/dashboardbuttons/Delivery/Deliveries';
import Reports from '../DashboardModule/Tabscreens/Reports';
import Orders from '../DashboardModule/Tabscreens/Orders';
import ContactUs from '../DashboardModule/Drawerscreens/ContactUs';
import AboutUs from '../DashboardModule/Drawerscreens/AboutUs';
import InvoiceDetails from '../DashboardModule/dashboardbuttons/Invoice/InvoiceDetails';
import Visitplanning from '../DashboardModule/dashboardbuttons/VisitTabs/Visitplanning';
import VerifyOtp from '../LoginModule/Loginscreen/VerifyOtp';
import WelcomeScreen from '../LoginModule/Welcomescreen/WelcomeScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Loading">

        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Loading" component={Loading} />
        <Stack.Screen options={{ headerShown: false }} name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen options={{ headerShown: false }} name="TabNavigation" component={TabNavigation} />
        <Stack.Screen options={{ headerShown: false }} name="CreateCustomer" component={CreateCustomer} />
        <Stack.Screen options={{ headerShown: false }} name="CreateVisit" component={CreateVisit} />
        <Stack.Screen options={{ headerShown: false }} name="Stage1" component={Stage1} />
        <Stack.Screen options={{ headerShown: false }} name="Stage2" component={Stage2} />
        <Stack.Screen options={{ headerShown: false }} name="VisitListTab" component={VisitListTab} />
        <Stack.Screen options={{ headerShown: false }} name="Outstanding" component={Outstanding} />
        <Stack.Screen options={{ headerShown: false }} name="ApprovedList" component={ApprovedList} />
        <Stack.Screen options={{ headerShown: false }} name="ProductList" component={ProductList} />
        <Stack.Screen options={{ headerShown: false }} name="VisitSoBillSummary" component={VisitSoBillSummary} />
        <Stack.Screen options={{ headerShown: false }} name="Deliveries" component={Deliveries} />
        <Stack.Screen options={{ headerShown: false }} name="Reports" component={Reports} />
        <Stack.Screen options={{ headerShown: false }} name="Orders" component={Orders} />
        <Stack.Screen options={{ headerShown: false }} name="AboutUs" component={AboutUs} />
        <Stack.Screen options={{ headerShown: false }} name="ContactUs" component={ContactUs} />
        <Stack.Screen options={{ headerShown: false }} name="InvoiceDetails" component={InvoiceDetails} />
        <Stack.Screen options={{ headerShown: false }} name="Visitplanning" component={Visitplanning} />
        <Stack.Screen options={{ headerShown: false }} name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen options={{ headerShown: false }} name="WelcomeScreen" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
