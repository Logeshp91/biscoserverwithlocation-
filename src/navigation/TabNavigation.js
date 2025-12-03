import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Screens from '../DashboardModule/Tabscreens/Screens';
import Settings from '../DashboardModule/Tabscreens/Settings';
import Orders from '../DashboardModule/Tabscreens/Orders';
import Reports from '../DashboardModule/Tabscreens/Reports';
import { View, StyleSheet, TextInput, Modal, Pressable, Dimensions, Image, Easing, Text, TouchableOpacity, Animated, View as RNView } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import messaging from '@react-native-firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, postcreatevisit } from "../redux/action";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigation = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [pushNotifications, setPushNotifications] = useState([]);
  const [partnerDisplayName, setPartnerDisplayName] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const slideAnim = useRef(new Animated.Value(250)).current;

  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
        const partner_display_name =  AsyncStorage.getItem('username');


useEffect(() => {
    // Fetch FCM token
    const fetchFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
        await AsyncStorage.setItem('fcmToken', token);
        console.log('FCM Token:', token);
      } catch (err) {
        console.log('Error fetching FCM token:', err);
      }
    };

    // Fetch IMEI
    const fetchIMEI = async () => {
      try {
        const imei = await DeviceInfo.getUniqueId();
        console.log('Device IMEI:', imei);
      } catch (err) {
        console.log('Error fetching IMEI:', err);
      }
    };

    fetchFcmToken();
    fetchIMEI();
  }, []);


  const { postauthendicationData, postauthendicationLoading, postauthendicationError, postauthendicationErrorInvalid } = 
  useSelector(state => state.postauthendicationReducer);

  const user = postauthendicationData || {};
  const firstLetter = user.partner_display_name
    ? user.partner_display_name.charAt(0).toUpperCase()
    : '';

  const PANEL_WIDTH = 250;

  let deviceImei = '';

  useEffect(() => {
  const fetchIMEI = async () => {
    deviceImei = await DeviceInfo.getUniqueId();
  };
  fetchIMEI();
}, []);


  /** Greeting */
  const now = new Date();
  const hours = now.getHours();
  const greetingText = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
  const formattedDate = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  /** Load AsyncStorage values */
  useEffect(() => {
    AsyncStorage.getItem('username').then(name => {
      if (name) setPartnerDisplayName(name);
    });
    messaging().getToken().then(token => {
      setFcmToken(token);
    });
  }, []);

  
  /** Background location tracking */
  const startLocationTracking = () => {
    const interval = setInterval(async () => {
      Geolocation.getCurrentPosition(
        async pos => {
          await sendLocationToServer(pos.coords);
        },
        err => console.warn("❌ Location error:", err.message),
        { enableHighAccuracy: true }
      );
    }, 5000);

    return () => clearInterval(interval); 
  };

  const sendLocationToServer = async (coords) => {
    const user_id = await AsyncStorage.getItem('user_id');
    const simNumber = await AsyncStorage.getItem("mobile_number");
    const token = fcmToken || (await AsyncStorage.getItem('fcmToken')) || '';
    const imei = deviceImei || (await DeviceInfo.getUniqueId()) || '';
    const body = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'user.location.tracking',
        method: 'create',
        args: [{
          user_id: Number(user_id),
          latitude: String(coords.latitude),
          longitude: String(coords.longitude),
          track_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          mobile_fcm_device_token: token || '',
          mobile_number: simNumber || '',
          mobile_imenumber: imei || "",       
         }],
        kwargs: {},
        context: {},
      },
      id: Date.now(),
    };
    console.log('📤 Sending location payload Tabnavigation:', JSON.stringify(body, null, 2));
    dispatch(postcreatevisit(body));

  };

  const tabIcons = {
    Screens: { lib: Foundation, active: 'home', inactive: 'home', size: 26 },
    Settings: { lib: FontAwesome6, active: 'user', inactive: 'user', size: 21 },
    Modal: { lib: Entypo, active: 'plus', inactive: 'plus', size: 10 },
    Orders: { lib: FontAwesome6, active: 'folder-minus', inactive: 'folder-minus', size: 23 },
    Reports: { lib: MaterialIcons, active: 'bar-chart', inactive: 'bar-chart', size: 26 },
  };

useEffect(() => {
  const timer = setInterval(() => {
    startLocationTracking();
    console.log("1-minute timer expired!");
  }, 600000);

  return () => clearInterval(timer); 
}, []);

  useEffect(() => {
    if (isPanelVisible) {
      slideAnim.setValue(PANEL_WIDTH);
      setTimeout(() => {
        setIsModalVisible(true);

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, 0);

    } else {
      Animated.timing(slideAnim, {
        toValue: PANEL_WIDTH,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setIsModalVisible(false);
      });
    }
  }, [isPanelVisible]);

useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    const newNotification = {
      id: Date.now().toString(),
      title: remoteMessage.notification?.title || "New Notification",
      body: remoteMessage.notification?.body || "",
    };

    // 1️⃣ Save in Redux
    dispatch(addNotification(newNotification));

    // 2️⃣ Save in local panel list
    setPushNotifications(prev => [newNotification, ...prev]);
  });

  return unsubscribe;
}, []);

const handleNotificationClick = (item) => {
  setIsPanelVisible(false); 

  if (item.title.includes("VisitListTab")) {
    navigation.navigate("VisitListTab");
  } 
  else if (item.title.includes("Report")) {
    navigation.navigate("Reports");
  }
  else {
    navigation.navigate("VisitListTab"); 
  }

 setPushNotifications(prev =>
  prev.filter(notif => notif.id !== item.id)
);
};

  return (
    <>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
         drawerPosition="right" 
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#FFFFFF", width: "55%", height: "90.5%", marginTop: "6.5%", borderTopRightRadius: 15,
            borderBottomRightRadius: 15, borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
            overflow: 'hidden',
          },
          headerStyle: {
            backgroundColor: '#353b87',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTintColor: '#ffffff',
        }}
      >
        <Drawer.Screen
          name=" "
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => (
              <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                <View>
                  <Text style={styles.greetingValue}> {partner_display_name || 'No Username'}
                  </Text>
                  <Text style={styles.greeting}>
                    {greetingText}, {formattedDate}</Text>
                </View>
              </View>
            ),
            headerRight: () => (
              <View style={styles.headerRightWrapper}>
                    <TouchableOpacity
      style={styles.notificationButton}
      onPress={() => setIsPanelVisible(true)}
    >
      <MaterialIcons name="notifications-none" size={28} color="#fff" />

   {pushNotifications.length > 0 && (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{pushNotifications.length}</Text>
  </View>
)}
    </TouchableOpacity>
             <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
  <View style={styles.circleAvatar}>
    <Text style={styles.avatarLetter}>{firstLetter}</Text>
  </View>
</TouchableOpacity>
              </View>
            ),
          })}
        >

          {() => (
            <View
              style={{ flex: 1, resizeMode: 'cover' }}
            >
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    const IconLib = tabIcons[route.name].lib;
                    const iconName = focused
                      ? tabIcons[route.name].active              
                      : tabIcons[route.name].inactive;
                    const iconSize = tabIcons[route.name].size;            
                    return <IconLib name={iconName} size={iconSize} color={color} />;
                  },
                  tabBarActiveTintColor: '#1468F5',
                  tabBarInactiveTintColor: '#747171',
                  tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    width: "100%",
                    alignSelf: "center",
                    borderRadius: 10,
                    marginTop: 0,
                  },
                  tabBarLabelStyle: { fontSize: 10, marginLeft: 1 },
                })}
              >
                <Tab.Screen
                  name="Screens"
                  component={Screens}
                  options={{ headerShown: false, tabBarLabel: 'Home' }}
                />
                <Tab.Screen
                  name="Settings"
                  component={Settings}
                  options={{ headerShown: false, tabBarLabel: 'Customers' }}
                />
                 <Tab.Screen
                  name="Orders"
                  component={Orders}
                  options={{ headerShown: false, tabBarLabel: 'Orders' }}
                />
                <Tab.Screen
                  name="Reports"
                  component={Reports}
                  options={{ headerShown: false, tabBarLabel: 'Reports' }}
                />
              </Tab.Navigator>
            </View>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
      <Modal transparent visible={isModalVisible} animationType="none">
        <Pressable style={styles.overlay} onPress={() => setIsPanelVisible(false)} />
        <Animated.View
          style={[
            styles.notificationPanel,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.panelTitle}>Notifications</Text>

       {pushNotifications.length === 0 ? (
  <Text style={{ color: "#777", textAlign: "center", marginTop: 10 }}>
    No notifications yet
  </Text>
) :pushNotifications.map(item => (
  <TouchableOpacity
    key={item.id}
    style={styles.notificationItem}
    onPress={() => handleNotificationClick(item)}
  >
    <Text style={styles.notificationText}>🔔 {item.title}</Text>

    {item.body ? (
      <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
        {item.body}
      </Text>
    ) : null}
  </TouchableOpacity>
)
)}

          <TouchableOpacity
            style={styles.closePanelBtn}
            onPress={() => setIsPanelVisible(false)}
          >
            <Text style={styles.closePanelText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

    </>
  );
};

export default TabNavigation;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
  },
  circleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: '#DDDFE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#250588',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  greeting: {
    color: "#fff",
    fontSize: 13,
    marginLeft:5
  },
  greetingValue: {
    color: "#fff",
    fontSize: 22,
    marginVertical:2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  notificationPanel: {
    position: "absolute",
    top: 55,
    right: 10,
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  notificationText: {
    fontSize: 14,
    color: "#555",
  },
  closePanelBtn: {
    marginTop: 20,
    backgroundColor: "#7630be",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closePanelText: {
    color: "#fff",
    fontWeight: "bold",
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#f3ecff',
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d7c6e7ff',
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7630be',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#7630be',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 10,
  },
  notificationButton: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
