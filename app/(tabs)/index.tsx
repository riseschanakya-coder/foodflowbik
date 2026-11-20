import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import RestaurantCard from '../../components/RestaurantCard';
import { useStore } from '../../context/StoreContext';
import { categories, restaurants } from '../../data/restaurants';

export default function Home(){
  const { userName } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const firstName = userName.trim().split(' ')[0] || 'there';

  const visibleRestaurants = selectedCategory
    ? restaurants.filter(r => `${r.name} ${r.cuisines}`.toLowerCase().includes(selectedCategory.toLowerCase()))
    : restaurants;

  const runX = useRef(new Animated.Value(70)).current;
  const runY = useRef(new Animated.Value(0)).current;
  const runRotate = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const greetings = ['Hi', 'Hello', 'Welcome'];
    const greetingTimer = setInterval(() => {
      setGreetingIndex(value => (value + 1) % greetings.length);
    }, 2200);

    const runLoop = Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(runX, { toValue: -22, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(runY, { toValue: -8, duration: 220, useNativeDriver: true }),
          Animated.timing(runY, { toValue: 0, duration: 220, useNativeDriver: true }),
          Animated.timing(runY, { toValue: -8, duration: 220, useNativeDriver: true }),
          Animated.timing(runY, { toValue: 0, duration: 240, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(runRotate, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(runRotate, { toValue: -1, duration: 220, useNativeDriver: true }),
          Animated.timing(runRotate, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(runRotate, { toValue: 0, duration: 240, useNativeDriver: true }),
        ]),
      ]),
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(runX, { toValue: 70, duration: 500, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(runY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(500),
    ]));

    const waveLoop = Animated.loop(Animated.sequence([
      Animated.timing(wave, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(wave, { toValue: -1, duration: 180, useNativeDriver: true }),
      Animated.timing(wave, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(wave, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.delay(2000),
    ]));

    runLoop.start();
    waveLoop.start();
    return () => { clearInterval(greetingTimer); runLoop.stop(); waveLoop.stop(); };
  }, [runX, runY, runRotate, wave]);

  return <SafeAreaView style={styles.safe}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening, {firstName}</Text>
          <Pressable style={styles.locationButton}>
            <Ionicons name="location" size={16} color="#E23744" />
            <View><Text style={styles.locationLabel}>Delivering to</Text><Text style={styles.location}>HSR Layout, Bengaluru</Text></View>
            <Ionicons name="chevron-down" size={15} color="#777" />
          </Pressable>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.search} onPress={() => router.push('/(tabs)/search')}>
        <Ionicons name="search" size={20} color="#E23744" />
        <Text style={styles.searchPlaceholder}>What are you craving?</Text>
        <View style={styles.searchDivider} />
        <Ionicons name="mic-outline" size={20} color="#777" />
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        {['Fast delivery','Top rated','Great offers','Pure veg'].map((label, index)=><Pressable key={label} style={[styles.pill, index === 0 && styles.activePill]}><Ionicons name={index === 0 ? 'time-outline' : index === 1 ? 'star-outline' : index === 2 ? 'pricetag-outline' : 'leaf-outline'} size={14} color={index === 0 ? '#fff' : '#555'} /><Text style={[styles.pillText, index === 0 && styles.activePillText]}>{label}</Text></Pressable>)}
      </ScrollView>

      <View style={styles.categorySection}>
        <Text style={styles.categoryHeading}>What sounds good?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map(c=><Pressable key={c.name} style={[styles.category, selectedCategory === c.name && styles.selectedCategory]} onPress={() => setSelectedCategory(selectedCategory === c.name ? '' : c.name)}>
            <View style={[styles.categoryIcon,{backgroundColor:c.color}]}>
              <Image source={{uri:c.image}} style={styles.categoryImage} resizeMode="cover" />
              <View style={styles.categoryHighlight} />
            </View>
            <Text style={styles.categoryName}>{c.name}</Text>
          </Pressable>)}
        </ScrollView>
      </View>

      <View style={styles.offerBanner}>
        <View style={{flex:1}}><Text style={styles.offerEyebrow}>Gonna Be a Good Day! 🥳</Text><Text style={styles.offerTitle}>Free delivery on 12:00–3:00 PM</Text><Pressable style={styles.offerButton}><Text style={styles.offerButtonText}>Order Now</Text></Pressable></View>
        <View style={styles.offerCircle}><Image source={{uri:'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=90'}} style={styles.offerImage} /></View>
      </View>

      <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>{selectedCategory ? `${selectedCategory} near you` : 'Top picks for you'}</Text><Text style={styles.sectionSub}>{selectedCategory ? 'Fresh favourites, picked locally' : 'Loved by people around you'}</Text></View><Pressable><Text style={styles.seeAll}>See all</Text></Pressable></View>
      {selectedCategory ? <View>{visibleRestaurants.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</View> : <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topPicks}>{restaurants.filter(r=>r.featured).map(r=><RestaurantCard key={r.id} restaurant={r} compact/> )}</ScrollView>
        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Recommended near you</Text><Text style={styles.sectionSub}>Because it is dinner time soon</Text></View></View>
        {restaurants.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}
      </>}

      <View style={styles.mascotCard}>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotHi}>{['Hi', 'Hello', 'Welcome'][greetingIndex]}, {firstName}! </Text>
          <Text style={styles.mascotSub}>Ready for something delicious?</Text>
        </View>
        <View style={styles.mascotStage}>
          <View style={styles.mascotShadow} />
          <Animated.View style={{transform:[{translateX:runX},{translateY:runY},{rotate:runRotate.interpolate({inputRange:[-1,1],outputRange:['-6deg','6deg']})}]}}>
            <Text style={styles.mascotLion}>🦁</Text>
            <Animated.Text style={[styles.mascotWave, {transform:[{rotate:wave.interpolate({inputRange:[-1,1],outputRange:['-18deg','18deg']})}]}]}>👋</Animated.Text>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F7F7'},scrollContent:{paddingBottom:30,maxWidth:Platform.OS==='web'?900:undefined,width:'100%',alignSelf:'center'},header:{paddingHorizontal:16,paddingTop:8,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},greeting:{fontSize:13,color:'#777',marginBottom:4},locationButton:{flexDirection:'row',alignItems:'center',gap:7},locationLabel:{fontSize:11,color:'#999'},location:{fontSize:16,fontWeight:'800',marginTop:1,color:'#262626'},avatar:{width:43,height:43,borderRadius:22,backgroundColor:'#FFE1E3',alignItems:'center',justifyContent:'center',shadowColor:'#E23744',shadowOpacity:.12,shadowRadius:8,shadowOffset:{width:0,height:4}},avatarText:{color:'#E23744',fontWeight:'900',fontSize:17},mascotCard:{height:118,marginHorizontal:16,marginTop:4,marginBottom:8,borderRadius:24,backgroundColor:'#EAF3FF',borderWidth:1,borderColor:'#D8E8FF',flexDirection:'row',alignItems:'center',overflow:'hidden',shadowColor:'#4D79AE',shadowOpacity:.12,shadowRadius:10,shadowOffset:{width:0,height:5},elevation:4},mascotBubble:{flex:1,paddingLeft:18,zIndex:2},mascotHi:{fontSize:20,fontWeight:'900',color:'#253A56'},mascotSub:{fontSize:12,color:'#667A96',marginTop:5},mascotStage:{width:118,height:118,alignItems:'center',justifyContent:'flex-end',marginRight:4},mascotLion:{fontSize:78,textAlign:'center',textShadowColor:'rgba(72,91,118,.22)',textShadowOffset:{width:0,height:5},textShadowRadius:4},mascotWave:{position:'absolute',right:-8,top:35,fontSize:24},mascotShadow:{position:'absolute',bottom:8,width:72,height:14,borderRadius:36,backgroundColor:'rgba(42,74,118,.16)'},search:{marginHorizontal:16,height:54,backgroundColor:'#fff',borderRadius:14,borderWidth:1,borderColor:'#E8E4E4',flexDirection:'row',alignItems:'center',paddingHorizontal:15,shadowColor:'#000',shadowOpacity:.09,shadowRadius:10,shadowOffset:{width:0,height:5},elevation:3},searchPlaceholder:{flex:1,fontSize:14,color:'#888',marginLeft:10},searchDivider:{width:1,height:24,backgroundColor:'#E5E5E5',marginRight:12},pills:{paddingHorizontal:16,paddingVertical:14,gap:8},pill:{height:34,borderRadius:17,backgroundColor:'#fff',borderWidth:1,borderColor:'#E8E5E5',paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:5,shadowColor:'#000',shadowOpacity:.04,shadowRadius:4,shadowOffset:{width:0,height:2}},activePill:{backgroundColor:'#E23744',borderColor:'#E23744',shadowColor:'#E23744',shadowOpacity:.18,shadowRadius:6,shadowOffset:{width:0,height:3}},pillText:{fontSize:12,fontWeight:'700',color:'#555'},activePillText:{color:'#fff'},categorySection:{marginTop:2},categoryHeading:{fontSize:20,fontWeight:'900',color:'#262626',marginHorizontal:16,marginBottom:10},categoryRow:{paddingHorizontal:16,gap:12},category:{alignItems:'center',width:64,paddingVertical:4,borderRadius:12},selectedCategory:{backgroundColor:'#FFF1F2'},categoryIcon:{width:56,height:56,borderRadius:28,alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.18,shadowRadius:7,shadowOffset:{width:0,height:5},elevation:4},categoryImage:{width:56,height:56,borderRadius:28},categoryHighlight:{...StyleSheet.absoluteFillObject,borderRadius:28,backgroundColor:'rgba(255,255,255,0.12)'},categoryName:{fontSize:12,fontWeight:'700',marginTop:7},offerBanner:{height:118,marginHorizontal:16,marginTop:18,borderRadius:18,backgroundColor:'#FFF1DC',padding:18,flexDirection:'row',alignItems:'center',overflow:'hidden',shadowColor:'#A66A20',shadowOpacity:.12,shadowRadius:10,shadowOffset:{width:0,height:5}},offerEyebrow:{fontSize:10,fontWeight:'900',color:'#A66A20',letterSpacing:.8},offerTitle:{fontSize:17,fontWeight:'900',color:'#432A12',marginTop:4},offerButton:{marginTop:8,height:36,paddingHorizontal:14,borderRadius:18,backgroundColor:'#E23744',alignItems:'center',justifyContent:'center',alignSelf:'flex-start',shadowColor:'#E23744',shadowOpacity:.22,shadowRadius:6,shadowOffset:{width:0,height:3}},offerButtonText:{color:'#fff',fontWeight:'800',fontSize:12},offerCircle:{width:82,height:82,borderRadius:41,backgroundColor:'#FFE2A8',alignItems:'center',justifyContent:'center',marginLeft:10,shadowColor:'#8A5A2B',shadowOpacity:.18,shadowRadius:8,shadowOffset:{width:0,height:5},elevation:5},offerImage:{width:82,height:82,borderRadius:41},sectionHeader:{marginHorizontal:16,marginTop:20,marginBottom:12,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},sectionTitle:{fontSize:20,fontWeight:'900',color:'#262626'},sectionSub:{fontSize:12,color:'#888',marginTop:3},seeAll:{color:'#E23744',fontWeight:'800',fontSize:13},topPicks:{paddingLeft:16,paddingRight:4}});
