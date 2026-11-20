import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../context/StoreContext';
import { Restaurant } from '../data/restaurants';

export default function RestaurantCard({ restaurant, compact=false }: { restaurant: Restaurant; compact?: boolean }) {
  const router = useRouter();
  const { favorites, toggleFavorite } = useStore();
  const saved = favorites.includes(restaurant.id);
  return (
    <Pressable style={[styles.card, compact && styles.compact]} onPress={() => router.push({pathname:'/restaurant/[id]', params:{id:restaurant.id}})}>
      <View>
        <Image source={{uri:restaurant.image}} style={[styles.image, compact && styles.compactImage]} />
        <View style={styles.offer}><Text style={styles.offerText}>{restaurant.offer}</Text></View>
        <Pressable hitSlop={12} style={styles.heart} onPress={() => toggleFavorite(restaurant.id)}>
          <Ionicons name={saved?'heart':'heart-outline'} size={20} color={saved?'#E23744':'#fff'} />
        </Pressable>
      </View>
      <View style={styles.info}><View style={{flex:1}}><Text numberOfLines={1} style={styles.name}>{restaurant.name}</Text><Text numberOfLines={1} style={styles.cuisine}>{restaurant.cuisines}</Text></View>
        <View style={{alignItems:'flex-end'}}><View style={styles.rating}><Text style={styles.ratingText}>{restaurant.rating} ★</Text></View><Text style={styles.meta}>{restaurant.time} • {restaurant.distance}</Text></View>
      </View>
    </Pressable>
  );
}
const styles=StyleSheet.create({card:{backgroundColor:'#fff',borderRadius:16,marginHorizontal:16,marginBottom:16,overflow:'hidden',borderWidth:1,borderColor:'#EFEEEE',shadowColor:'#5B3928',shadowOpacity:.14,shadowRadius:14,shadowOffset:{width:0,height:8},elevation:6},compact:{width:280,marginRight:12,marginLeft:0},image:{width:'100%',height:168,shadowColor:'#000',shadowOpacity:.16,shadowRadius:6},compactImage:{height:145},offer:{position:'absolute',left:10,bottom:10,backgroundColor:'#1678F2',borderRadius:5,paddingHorizontal:8,paddingVertical:5,shadowColor:'#123E82',shadowOpacity:.28,shadowRadius:5,shadowOffset:{width:0,height:3}},offerText:{color:'#fff',fontWeight:'900',fontSize:11},heart:{position:'absolute',right:10,top:10,width:36,height:36,borderRadius:18,backgroundColor:'rgba(255,255,255,.92)',alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.18,shadowRadius:6,shadowOffset:{width:0,height:3},elevation:4},info:{padding:12,flexDirection:'row'},name:{fontSize:16,fontWeight:'900',color:'#242424'},cuisine:{fontSize:12,color:'#777',marginTop:4},rating:{backgroundColor:'#248A3D',borderRadius:7,paddingHorizontal:7,paddingVertical:4,shadowColor:'#155E2B',shadowOpacity:.18,shadowRadius:4,shadowOffset:{width:0,height:2}},ratingText:{color:'#fff',fontWeight:'900',fontSize:11},meta:{color:'#777',fontSize:11,marginTop:5}});
