import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RestaurantCard from '../../components/RestaurantCard';
import { restaurants } from '../../data/restaurants';

export default function Search(){const [query,setQuery]=useState('');const results=restaurants.filter(r=>`${r.name} ${r.cuisines}`.toLowerCase().includes(query.toLowerCase()));return <SafeAreaView style={styles.safe}><View style={styles.search}><Ionicons name="search" size={20} color="#E23744"/><TextInput value={query} onChangeText={setQuery} autoFocus placeholder="Search restaurants or cuisines" style={styles.input}/>{query?<Ionicons name="close-circle" size={20} color="#999" onPress={()=>setQuery('')}/>:null}</View><ScrollView><Text style={styles.title}>{query?`${results.length} results`:'Popular searches'}</Text>{results.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}{!results.length&&<View style={styles.empty}><Text style={{fontSize:42}}>🍽️</Text><Text style={styles.emptyText}>No dishes found</Text><Text style={styles.emptySub}>Try searching for pizza, biryani or burgers</Text></View>}</ScrollView></SafeAreaView>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#FAFAFA'},search:{height:52,margin:16,backgroundColor:'#fff',borderRadius:12,borderWidth:1,borderColor:'#E8E5E5',flexDirection:'row',alignItems:'center',paddingHorizontal:14},input:{flex:1,fontSize:15,marginHorizontal:10},title:{fontSize:18,fontWeight:'800',marginHorizontal:16,marginBottom:12},empty:{alignItems:'center',paddingTop:80},emptyText:{fontWeight:'800',fontSize:18,marginTop:12},emptySub:{color:'#777',marginTop:5}});
