import { Stack, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StoreProvider, useStore } from '../context/StoreContext';
import { StatusBar } from 'expo-status-bar';

function TabsLayout() {
  const { cart } = useStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <><StatusBar style="dark" /><Tabs screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:'#E23744',tabBarInactiveTintColor:'#8A8A8A',tabBarLabelStyle:{fontSize:11,fontWeight:'700'},tabBarIcon:({color,size})=>{const icons:Record<string,keyof typeof Ionicons.glyphMap>={index:'home',search:'search',favorites:'heart',cart:'cart',profile:'person'};return <Ionicons name={icons[route.name]??'ellipse'} size={size} color={color}/>},tabBarBadge:route.name==='cart'&&count?count:undefined})}><Tabs.Screen name="index" options={{title:'Home'}}/><Tabs.Screen name="search" options={{title:'Search'}}/><Tabs.Screen name="favorites" options={{title:'Favorites'}}/><Tabs.Screen name="cart" options={{title:'Cart'}}/><Tabs.Screen name="profile" options={{title:'Profile'}}/><Tabs.Screen name="restaurant/[id]" options={{href:null}}/></Tabs></>;
}
export default function Layout(){
  return <StoreProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  </StoreProvider>
}
