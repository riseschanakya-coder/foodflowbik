import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RestaurantCard from '../../components/RestaurantCard';
import { useStore } from '../../context/StoreContext';
import { restaurants } from '../../data/restaurants';

export default function Favorites(){const {favorites}=useStore();const saved=restaurants.filter(r=>favorites.includes(r.id));return <SafeAreaView style={styles.safe}><Text style={styles.heading}>Your favorites</Text><ScrollView>{saved.length?saved.map(r=><RestaurantCard key={r.id} restaurant={r}/>):<View style={styles.empty}><Text style={{fontSize:48}}>♡</Text><Text style={styles.title}>Nothing saved yet</Text><Text style={styles.sub}>Tap the heart on restaurants you love</Text></View>}</ScrollView></SafeAreaView>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#FAFAFA'},heading:{fontSize:24,fontWeight:'bold',margin:16},empty:{alignItems:'center',paddingTop:130},title:{fontSize:18,fontWeight:'600',marginTop:12},sub:{color:'#777',marginTop:6}});
