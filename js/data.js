/* FreshBite - data layer
   All restaurants (R) and dishes (D) live in plain JavaScript arrays. No database needed. */
// ---------- Data ----------
const R=[{id:1,n:"Napoli Corner",c:"Italian",r:4.6,p:2,t:"30–40 min",e:"🍕"},{id:2,n:"Spice Route",c:"Indian",r:4.5,p:2,t:"35–45 min",e:"🍛"},{id:3,n:"Green Bowl",c:"Healthy",r:4.3,p:1,t:"20–30 min",e:"🥗"},{id:4,n:"Dragon Wok",c:"Chinese",r:4.2,p:2,t:"30–40 min",e:"🥡"},{id:5,n:"Sugar & Crumb",c:"Desserts",r:4.7,p:1,t:"25–35 min",e:"🧁"}];
const cuis=[...new Set(R.map(r=>r.c))];
// id, restaurant, name, emoji, price, tags (v=Veg n=Non-Veg g=Gluten-Free), description, ingredients, kcal, protein, carbs, fat
const D=[[1,1,"Margherita Pizza","🍕",299,"v","Wood-fired base with basil and fresh mozzarella.","Dough, tomato, mozzarella, basil",780,32,98,26],
[2,1,"Pepperoni Pizza","🍕",379,"n","Crisp pepperoni over bubbling mozzarella.","Dough, tomato, mozzarella, pepperoni",910,38,96,40],
[3,1,"Penne Arrabbiata","🍝",259,"v","Penne in a spicy tomato and garlic sauce.","Penne, tomato, garlic, chilli, olive oil",520,16,84,14],
[4,2,"Butter Chicken","🍗",349,"n g","Creamy tomato gravy with tender tandoori chicken.","Chicken, tomato, butter, cream, spices",640,42,18,44],
[5,2,"Paneer Tikka Masala","🧀",319,"v g","Smoky paneer in a rich, spiced gravy.","Paneer, capsicum, tomato, cashew, spices",580,24,22,40],
[6,2,"Veg Biryani","🍚",229,"v g","Fragrant basmati layered with vegetables and saffron.","Basmati, vegetables, saffron, mint, ghee",610,14,96,18],
[7,3,"Quinoa Power Bowl","🥗",269,"v g","Quinoa, chickpeas and avocado with a lemon dressing.","Quinoa, chickpeas, avocado, greens, lemon",430,16,52,18],
[8,3,"Grilled Chicken Salad","🥙",289,"n g","Grilled chicken over crunchy greens.","Chicken, lettuce, tomato, cucumber, olive oil",380,34,12,20],
[9,4,"Hakka Noodles","🍜",199,"v","Wok-tossed noodles with crunchy vegetables.","Noodles, cabbage, carrot, soy sauce, spring onion",480,12,78,12],
[10,4,"Chilli Garlic Chicken","🥡",299,"n","Crisp chicken tossed in a hot garlic sauce.","Chicken, garlic, chilli, soy, bell pepper",560,36,34,28],
[11,5,"Chocolate Lava Cake","🧁",149,"v","Warm cake with a molten dark chocolate centre.","Flour, dark chocolate, egg, butter, sugar",420,6,48,24],
[12,5,"Mango Cheesecake","🍰",179,"v","Chilled cheesecake with an alphonso mango topping.","Cream cheese, biscuit, mango, cream",380,7,40,22]]
.map(a=>({id:a[0],r:a[1],n:a[2],e:a[3],p:a[4],t:a[5],d:a[6],i:a[7],k:a[8],pr:a[9],cb:a[10],ft:a[11]}));
