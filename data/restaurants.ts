export type MenuItem = { id: string; name: string; description: string; price: number; veg: boolean; image: string; }; 
export type Restaurant = { id: string; name: string; cuisines: string; rating: number; time: string; distance: string; offer: string; image: string; featured?: boolean; menu: MenuItem[] };

export const categories = [
  { name: 'Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=240&q=90', color: '#FFF0DE' },
  { name: 'Stores', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=240&q=90', color: '#FFEAF2' },
  { name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=240&q=90', color: '#E7F7E8' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=240&q=90', color: '#FFF1DB' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1574076072652-81c09a1c7bd7?auto=format&fit=crop&w=240&q=90', color: '#FFE5E5' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&q=90', color: '#FFEAF2' },
];

const foodImage = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const restaurants: Restaurant[] = [
  { id:'1', name:'The Punjabi Table', cuisines:'North Indian • Punjabi • Biryani', rating:4.6, time:'28 min', distance:'1.8 km', offer:'50% OFF up to ₹100', featured:true, image:foodImage('photo-1585937421612-70a008356fbe'), menu:[
    {id:'11',name:'Butter Chicken',description:'Creamy tomato gravy, house spices and fresh cream',price:329,veg:false,image:foodImage('photo-1603894584373-5ac82b2ae398')},
    {id:'12',name:'Paneer Tikka Masala',description:'Charred cottage cheese in rich masala',price:285,veg:true,image:foodImage('photo-1631452180519-c014fe946bc7')},
    {id:'13',name:'Hyderabadi Biryani',description:'Fragrant basmati rice with saffron and spices',price:349,veg:false,image:foodImage('photo-1563379926898-05f4575a45d8')}
  ]},
  { id:'2', name:'Urban Pizza Co.', cuisines:'Pizza • Italian • Pasta', rating:4.5, time:'22 min', distance:'2.1 km', offer:'Flat ₹125 OFF', featured:true, image:foodImage('photo-1574076072652-81c09a1c7bd7'), menu:[
    {id:'21',name:'Farmhouse Pizza',description:'Bell peppers, mushrooms, olives and mozzarella',price:399,veg:true,image:foodImage('photo-1574076072652-81c09a1c7bd7')},
    {id:'22',name:'Pepperoni Feast',description:'Loaded pepperoni and oregano',price:449,veg:false,image:foodImage('photo-1628840042765-356cda07504e')},
    {id:'23',name:'Pesto Pasta',description:'Creamy basil pesto with parmesan',price:299,veg:true,image:foodImage('photo-1473093295043-cdd812d0e601')}
  ]},
  { id:'3', name:'Stacked Burgers', cuisines:'Burgers • American • Fries', rating:4.7, time:'18 min', distance:'1.2 km', offer:'Buy 1 Get 1 Free', featured:true, image:foodImage('photo-1568901346375-23c9450c58cd'), menu:[
    {id:'31',name:'Smash Burger',description:'Double beef patty, cheddar and signature sauce',price:289,veg:false,image:foodImage('photo-1568901346375-23c9450c58cd')},
    {id:'32',name:'Crispy Veg Burger',description:'Crunchy veg patty with sriracha mayo',price:229,veg:true,image:foodImage('photo-1520072959219-c595dc870360')},
    {id:'33',name:'Loaded Fries',description:'Cheese sauce, jalapeños and herbs',price:199,veg:true,image:foodImage('photo-1573080496219-bb080dd4f877')}
  ]},
  { id:'4', name:'Green Bowl', cuisines:'Healthy • Salads • Bowls', rating:4.4, time:'24 min', distance:'3.0 km', offer:'20% OFF', image:foodImage('photo-1546793665-c74683f339c1'), menu:[
    {id:'41',name:'Protein Power Bowl',description:'Quinoa, chickpeas, avocado and greens',price:319,veg:true,image:foodImage('photo-1546793665-c74683f339c1')},
    {id:'42',name:'Chicken Caesar',description:'Grilled chicken, crisp lettuce and caesar dressing',price:349,veg:false,image:foodImage('photo-1546793665-c74683f339c1')}
  ]},
];
