/* FreshBite - application logic
   State + localStorage, page templates (P), hash router, event handlers.
   Requires js/data.js to be loaded first. */
// ---------- State (saved in localStorage) ----------
let S={cart:{},wish:[],user:null,reg:{},orders:[],addrs:[],coupon:"",next:null,f:{c:"",r:0,p:0,d:""}};
try{Object.assign(S,JSON.parse(localStorage.getItem("fb")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("fb",JSON.stringify(S))}catch(e){}};

// ---------- Helpers ----------
const $=s=>document.querySelector(s);
const J=(a,f)=>a.map(f).join("");
const money=n=>"₹"+n;
const cnt=()=>Object.values(S.cart).reduce((a,b)=>a+b,0);
const lines=()=>Object.entries(S.cart).map(([id,q])=>({d:D.find(x=>x.id==id),q})).filter(l=>l.d);
const tot=()=>{const sub=lines().reduce((s,l)=>s+l.d.p*l.q,0);const disc=S.coupon==="FRESH10"?Math.round(sub*.1):0;const fee=sub&&sub-disc<500?40:0;const tax=Math.round((sub-disc)*.05);return{sub,disc,fee,tax,total:sub-disc+fee+tax}};
const tagH=t=>t.split(" ").map(x=>`<span class="tag ${x}">${{v:"Veg",n:"Non-Veg",g:"Gluten-Free"}[x]}</span>`).join("");
const dishCard=d=>`<article class="card dish"><a class="tile" href="#dish-${d.id}" aria-label="${d.n}">${d.e}</a><div class="b"><h3><a href="#dish-${d.id}">${d.n}</a></h3>${tagH(d.t)}<p class="m">${d.d}</p><div class="row"><b>${money(d.p)}</b><button class="btn sm" data-add="${d.id}">Add to cart</button></div></div></article>`;
const restCard=r=>`<a class="card" href="#menu-${r.id}" style="text-decoration:none"><div class="tile">${r.e}</div><div class="b"><h3>${r.n}</h3><p class="m">${r.c}, ${"₹".repeat(r.p)}</p><p>★ ${r.r.toFixed(1)} &nbsp; ${r.t}</p></div></a>`;
const rows=t=>`<div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.disc?`<div class="row"><span>Coupon FRESH10</span><span>−${money(t.disc)}</span></div>`:""}<div class="row"><span>Delivery</span><span>${t.fee?money(t.fee):"Free"}</span></div><div class="row"><span>GST (5%)</span><span>${money(t.tax)}</span></div><div class="row tt"><b>Total</b><b>${money(t.total)}</b></div>`;
const loginAsk=m=>`<section><h1>${m}</h1><p class="m">Log in to continue. It takes a few seconds.</p><a class="btn" href="#login">Log in</a> <a class="btn o" href="#register">Create account</a></section>`;
const field=(l,n,t="text",v="")=>`<label>${l}<input name="${n}" type="${t}" value="${v}" required></label>`;
let tt;function toast(m){const e=$("#toast");e.textContent=m;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,1800)}

// ---------- Pages ----------
const P={
home:()=>`<section class="hero"><div><h1>Hot from the kitchen, right to your door.</h1><p class="m">Order from five neighbourhood kitchens. Fresh, fast and still warm when it arrives.</p><p><a class="btn" href="#restaurants">Order now</a> <button class="btn o" data-go="feat">See today’s picks</button></p></div><div class="plate">🍕<i style="top:4%;left:0">🍅</i><i style="bottom:4%;right:0">🌿</i><i style="top:6%;right:4%">🌶️</i></div></section>
<section><h2>What are you craving?</h2><div class="chips">${J(cuis,c=>`<button class="btn o" data-cuisine="${c}">${c}</button>`)}</div></section>
<section id="feat"><h2>Featured dishes</h2><div class="grid">${J([1,4,7,11].map(i=>D[i-1]),dishCard)}</div></section>
<section><h2>Special offers</h2><div class="three"><div class="offer"><h3>10% off your first order</h3><p>Use code <b>FRESH10</b> in your cart.</p></div><div class="offer d"><h3>Free delivery over ₹500</h3><p>Applied automatically at checkout.</p></div></div></section>`,

restaurants:()=>{const f=S.f;const L=R.filter(r=>(!f.c||r.c===f.c)&&r.r>=f.r&&(!f.p||r.p===f.p));
return `<section><h1>Restaurants</h1><div class="fl"><label>Cuisine<select data-f="c"><option value="">All cuisines</option>${J(cuis,c=>`<option ${f.c===c?"selected":""}>${c}</option>`)}</select></label><label>Rating<select data-f="r">${J([[0,"Any rating"],[4,"4.0 and above"],[4.5,"4.5 and above"]],([v,n])=>`<option value="${v}" ${f.r===v?"selected":""}>${n}</option>`)}</select></label><label>Price<select data-f="p">${J([[0,"Any price"],[1,"₹ Budget"],[2,"₹₹ Mid-range"]],([v,n])=>`<option value="${v}" ${f.p===v?"selected":""}>${n}</option>`)}</select></label></div>${L.length?`<div class="grid">${J(L,restCard)}</div>`:`<p>No restaurants match these filters. Try a different cuisine or rating.</p>`}</section>`},

menu:a=>{const r=R.find(x=>x.id==a);const L=D.filter(d=>(!r||d.r===r.id)&&(!S.f.d||d.t.split(" ").includes(S.f.d)));
return `<section><h1>${r?r.n:"All dishes"}</h1><p class="m">${r?`${r.c} cuisine, rated ${r.r}, delivers in ${r.t}`:"Every kitchen on one menu."}</p><div class="chips" style="margin:14px 0 20px">${J([["","All"],["v","Veg"],["n","Non-Veg"],["g","Gluten-Free"]],([k,n])=>`<button class="btn o sm ${S.f.d===k?"on":""}" data-d="${k}">${n}</button>`)}</div>${L.length?`<div class="grid">${J(L,dishCard)}</div>`:`<p>No dishes match this filter here. Try “All”.</p>`}</section>`},

dish:a=>{const d=D.find(x=>x.id==a);if(!d)return P.nf();const r=R.find(x=>x.id==d.r);const w=S.wish.includes(d.id);
return `<section class="two"><div class="card"><div class="tile big">${d.e}</div></div><div><h1>${d.n}</h1><p class="m">From <a href="#menu-${r.id}">${r.n}</a></p>${tagH(d.t)}<p>${d.d}</p><h3>Ingredients</h3><p>${d.i}</p><h3>Nutrition per serving</h3><p><span class="tag">${d.k} kcal</span><span class="tag">${d.pr} g protein</span><span class="tag">${d.cb} g carbs</span><span class="tag">${d.ft} g fat</span></p><h2>${money(d.p)}</h2><button class="btn" data-add="${d.id}">Add to cart</button> <button class="btn o" data-wish="${d.id}">${w?"Saved to wishlist ♥":"Save to wishlist ♡"}</button></div></section>`},

cart:()=>{const L=lines();if(!L.length)return `<section><h1>Your cart is empty</h1><p class="m">Add a dish from the menu to get started.</p><a class="btn" href="#menu-all">Browse the menu</a></section>`;
return `<section><h1>Your cart</h1><div class="two"><div>${J(L,l=>`<div class="ln"><span class="e">${l.d.e}</span><div style="flex:1"><b>${l.d.n}</b><div class="m">${money(l.d.p)} each</div></div><div class="q"><button data-q="${l.d.id}:-1" aria-label="Remove one">−</button><b>${l.q}</b><button data-q="${l.d.id}:1" aria-label="Add one">+</button></div><b>${money(l.d.p*l.q)}</b></div>`)}</div><div class="card b"><h3>Order summary</h3>${rows(tot())}<label>Coupon code<input id="cp" value="${S.coupon}" placeholder="Try FRESH10"></label><button class="btn o sm" data-coupon style="margin-top:8px">Apply code</button><a class="btn w100" href="#checkout" style="text-align:center">Go to checkout</a></div></div></section>`},

checkout:()=>{const L=lines();if(!L.length)return P.cart();if(!S.user){S.next="checkout";return loginAsk("Log in to check out")}
const a=S.addrs[0]||"";
return `<section><h1>Checkout</h1><form data-form="order" class="two"><div><h3>Delivery address</h3>${field("Full name","name","text",S.user.name)}${field("Phone","phone","tel")}<label>Address<textarea name="addr" rows="3" required>${a}</textarea></label><h3 style="margin-top:18px">Payment method</h3>${J(["UPI","Card on delivery","Cash on delivery"],(m,i)=>`<label class="r"><input type="radio" name="pay" value="${m}" ${i?"":"checked"}>${m}</label>`)}<h3 style="margin-top:18px">Delivery time</h3><select name="time">${J(["As soon as possible","In 30 minutes","In 1 hour","Tonight, 8:00 PM"],x=>`<option>${x}</option>`)}</select></div><div class="card b"><h3>Order summary</h3>${J(L,l=>`<div class="row"><span>${l.q} × ${l.d.n}</span><span>${money(l.d.p*l.q)}</span></div>`)}${rows(tot())}<button class="btn w100">Place order</button></div></form></section>`},

done:a=>{const o=S.orders.find(x=>x.id===a);if(!o)return P.nf();
return `<section><h1>Order placed 🎉</h1><p>Thanks, ${S.user?S.user.name:"friend"}. Your order <b>${o.id}</b> is being prepared.</p><div class="card b"><p>${o.items.join("<br>")}</p><p><b>Total ${money(o.total)}</b>, paid by ${o.pay}</p><p class="m">Delivery: ${o.time}<br>To: ${o.addr}</p></div><p><a class="btn" href="#account">View order history</a></p></section>`},

account:()=>{if(!S.user)return loginAsk("Your account");
const w=S.wish.map(i=>D.find(d=>d.id===i)).filter(Boolean);
return `<section><h1>Hi, ${S.user.name}</h1><p class="m">${S.user.email}</p><button class="btn o sm" data-logout>Log out</button></section>
<section><h2>Order history</h2>${S.orders.length?J(S.orders,o=>`<div class="card b" style="margin-bottom:10px"><div class="row"><b>${o.id}</b><span class="m">${o.date}</span></div><p>${o.items.join(", ")}</p><b>${money(o.total)}</b></div>`):`<p class="m">No orders yet. <a href="#menu-all">Find something tasty</a>.</p>`}</section>
<section><h2>Saved addresses</h2>${J(S.addrs,(a,i)=>`<div class="ln"><span style="flex:1">${a}</span><button class="btn o sm" data-deladdr="${i}">Remove</button></div>`)}<form data-form="addr" class="row" style="margin-top:12px"><input name="addr" placeholder="Add a new address" required><button class="btn sm">Save</button></form></section>
<section><h2>Wishlist</h2>${w.length?`<div class="grid">${J(w,dishCard)}</div>`:`<p class="m">Tap “Save to wishlist” on any dish to keep it here.</p>`}</section>`},

login:()=>`<section style="max-width:420px"><h1>Welcome back</h1><form data-form="login">${field("Email","email","email")}${field("Password (4+ characters)","pw","password")}<button class="btn w100">Log in</button></form><p>New here? <a href="#register">Create an account</a></p></section>`,
register:()=>`<section style="max-width:420px"><h1>Create your account</h1><form data-form="register">${field("Name","name")}${field("Email","email","email")}${field("Password (4+ characters)","pw","password")}<button class="btn w100">Create account</button></form><p>Already registered? <a href="#login">Log in</a></p></section>`,

about:()=>`<section><h1>Our story</h1><p style="max-width:62ch">FreshBite began in a tiny kitchen with one rule: food should reach you the way the cook meant it. We partner with neighbourhood kitchens, cook to order and deliver within the hour.</p></section>
<section><h2>The team</h2><div class="three">${J([["🧑‍🍳","Meera Rao","Head chef"],["🛵","Arjun Das","Delivery lead"],["💻","Sana Khan","Product and tech"]],t=>`<div class="card b"><div style="font-size:3rem">${t[0]}</div><h3>${t[1]}</h3><p class="m">${t[2]}</p></div>`)}</div></section>
<section><h2>Awards</h2><div class="three">${J(["Best Local Delivery 2025","Readers’ Choice, Comfort Food","Zero-waste Kitchen Badge"],t=>`<div class="card b">🏆 ${t}</div>`)}</div></section>`,

contact:()=>`<section class="two"><div><h1>Get in touch</h1><p><b>Phone:</b> +91 98765 43210<br><b>Email:</b> hello@freshbite.example<br><b>Address:</b> 12 Park Street, Kolkata 700016</p><p><b>Hours:</b> Mon–Fri 10 am–11 pm, Sat–Sun 9 am–midnight</p><svg viewBox="0 0 400 200" role="img" aria-label="Map showing the FreshBite kitchen" style="width:100%;border-radius:18px;border:1px solid var(--ln)"><rect width="400" height="200" fill="var(--tile)"/><path d="M0 120H400M140 0V200M280 0L220 200M0 50L400 80" stroke="var(--bg)" stroke-width="12" fill="none"/><circle cx="140" cy="120" r="12" fill="#FF6B35"/><text x="140" y="125" font-size="14" text-anchor="middle">🍊</text><text x="160" y="150" font-size="13" fill="var(--tx)">FreshBite kitchen</text></svg></div><form data-form="contact" class="card b"><h3>Send us a message</h3>${field("Name","name")}${field("Email","email","email")}<label>Message<textarea name="msg" rows="4" required></textarea></label><button class="btn w100">Send message</button></form></section>`,
nf:()=>`<section><h1>We couldn’t find that page</h1><a class="btn" href="#home">Back to home</a></section>`
};

// ---------- Router ----------
function nav(){const h=(location.hash.slice(1)||"home").split("-")[0];const L=[["home","Home"],["restaurants","Restaurants"],["menu","Menu"],["about","About"],["contact","Contact"]];
$("#nav").innerHTML=`<a class="logo" href="#home">🍊 FreshBite</a>`+J(L,([k,n])=>`<a href="#${k==="menu"?"menu-all":k}" class="${h===k?"on":""}">${n}</a>`)+`<span class="sp"></span><a class="btn sm" href="#cart">Cart (${cnt()})</a><a class="btn sm o" href="#${S.user?"account":"login"}">${S.user?"Account":"Log in"}</a>`}
function render(top){const h=location.hash.slice(1)||"home";const i=h.indexOf("-");const p=i<0?h:h.slice(0,i),a=i<0?"":h.slice(i+1);
$("#app").innerHTML=(P[p]||P.nf)(a);nav();if(top)scrollTo(0,0)}
addEventListener("hashchange",()=>render(true));

// ---------- Events ----------
document.addEventListener("click",e=>{const t=e.target.closest("[data-add],[data-q],[data-wish],[data-coupon],[data-logout],[data-cuisine],[data-d],[data-go],[data-deladdr]");if(!t)return;const x=t.dataset;
if(x.add){S.cart[x.add]=(S.cart[x.add]||0)+1;toast("Added to cart")}
else if(x.q){const[i,n]=x.q.split(":");S.cart[i]=(S.cart[i]||0)+ +n;if(S.cart[i]<=0)delete S.cart[i]}
else if(x.wish){const i=+x.wish;S.wish=S.wish.includes(i)?S.wish.filter(v=>v!==i):[...S.wish,i]}
else if(x.coupon!==undefined){const c=$("#cp").value.trim().toUpperCase();if(c==="FRESH10"||!c){S.coupon=c;toast(c?"Coupon applied":"Coupon removed")}else toast("Code not valid. Try FRESH10.")}
else if(x.logout!==undefined){S.user=null;location.hash="home"}
else if(x.cuisine){S.f.c=x.cuisine;save();location.hash="restaurants";return}
else if(x.d!==undefined){S.f.d=x.d}
else if(x.go){document.getElementById(x.go).scrollIntoView();return}
else if(x.deladdr!==undefined){S.addrs.splice(+x.deladdr,1)}
save();render()});

document.addEventListener("change",e=>{const k=e.target.dataset.f;if(k){S.f[k]=k==="c"?e.target.value:+e.target.value;save();render()}});

document.addEventListener("submit",e=>{e.preventDefault();const f=e.target,k=f.dataset.form,v=Object.fromEntries(new FormData(f));
if(k==="login"||k==="register"){if(v.pw.length<4)return toast("Password needs at least 4 characters");
if(k==="register")S.reg[v.email]=v.name;S.user={name:S.reg[v.email]||v.email.split("@")[0],email:v.email};const n=S.next;S.next=null;save();location.hash=n||"account";return}
if(k==="addr"){S.addrs.push(v.addr)}
if(k==="contact"){f.reset();return toast("Message sent. We’ll reply within a day.")}
if(k==="order"){const t=tot(),id="FB"+Date.now().toString().slice(-6);
S.orders.unshift({id,date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),items:lines().map(l=>l.q+" × "+l.d.n),total:t.total,time:v.time,pay:v.pay,addr:v.addr});
if(!S.addrs.includes(v.addr))S.addrs.unshift(v.addr);S.cart={};S.coupon="";save();location.hash="done-"+id;return}
save();render()});

render(true);
