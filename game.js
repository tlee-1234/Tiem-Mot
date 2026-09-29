const KEY="tiem-mot-v1";
const PRODUCTS=[
 {id:"dress",name:"Váy hồng",cat:"Quần áo",icon:"👗",price:80,cost:30},
 {id:"cardigan",name:"Áo cardigan",cat:"Quần áo",icon:"🧥",price:70,cost:28},
 {id:"skirt",name:"Chân váy",cat:"Quần áo",icon:"👚",price:65,cost:25},
 {id:"tee",name:"Áo thun",cat:"Quần áo",icon:"👕",price:55,cost:20},
 {id:"set",name:"Set đi chơi",cat:"Quần áo",icon:"🎀",price:100,cost:40},
 {id:"mini",name:"Túi mini",cat:"Túi",icon:"👜",price:75,cost:30},
 {id:"shoulder",name:"Túi đeo vai",cat:"Túi",icon:"👝",price:90,cost:36},
 {id:"pastelbag",name:"Túi pastel",cat:"Túi",icon:"🛍️",price:95,cost:38},
 {id:"bowbag",name:"Túi nơ",cat:"Túi",icon:"🎁",price:110,cost:44},
 {id:"sneaker",name:"Sneaker",cat:"Giày",icon:"👟",price:85,cost:34},
 {id:"dollshoe",name:"Giày búp bê",cat:"Giày",icon:"🥿",price:80,cost:32},
 {id:"sandal",name:"Sandal",cat:"Giày",icon:"👡",price:70,cost:28},
 {id:"pastelshoe",name:"Giày pastel",cat:"Giày",icon:"👟",price:100,cost:40},
 {id:"necklace",name:"Vòng cổ",cat:"Phụ kiện",icon:"📿",price:65,cost:26},
 {id:"hairclip",name:"Kẹp tóc",cat:"Phụ kiện",icon:"🎀",price:45,cost:18},
 {id:"bow",name:"Nơ",cat:"Phụ kiện",icon:"🎗️",price:40,cost:16},
 {id:"earring",name:"Bông tai",cat:"Phụ kiện",icon:"💎",price:60,cost:24},
 {id:"bracelet",name:"Vòng tay",cat:"Phụ kiện",icon:"📿",price:55,cost:22}
];
const CUSTOMERS=[
 {name:"Mimi",avatar:"🐰",need:["dress","set","hairclip"],lines:["Mình muốn một chiếc váy xinh!","Có đồ nào thật ngọt ngào không?"]},
 {name:"Bơ",avatar:"🐻",need:["mini","pastelbag","bowbag"],lines:["Có túi nào dễ thương không?","Mình đang tìm một chiếc túi mới!"]},
 {name:"Miu",avatar:"🐱",need:["sneaker","dollshoe","pastelshoe"],lines:["Mình cần đôi giày mới!","Có đôi nào pastel không?"]},
 {name:"Nana",avatar:"🐶",need:["cardigan","skirt","tee"],lines:["Mình muốn đồ mặc hằng ngày.","Áo nào mềm xinh nhỉ?"]},
 {name:"Lala",avatar:"🦊",need:["necklace","earring","bracelet"],lines:["Mình muốn thêm chút lấp lánh!","Có phụ kiện xinh không?"]}
];
const DEFAULT={
 coins:420,level:1,xp:0,customers:0,reputation:0,sold:0,
 unlocked:["dress","cardigan","skirt","tee","set","mini","shoulder","pastelbag","bowbag","sneaker","dollshoe","sandal","pastelshoe"],
 upgrades:{decor:0,ads:0,floor2:0}, sound:true,
 stock:{dress:3,cardigan:3,skirt:3,tee:3,set:2,mini:3,shoulder:2,pastelbag:2,bowbag:2,sneaker:3,dollshoe:2,sandal:2,pastelshoe:2},
 quest:{target:5,progress:0,reward:100,done:false},
 customerIndex:0, tab:"home"
};
let state=load(); let activeCustomer=null; let stockCat="Tất cả";
const $=s=>document.querySelector(s);
function load(){try{return {...structuredClone(DEFAULT),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){return structuredClone(DEFAULT)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function xpNeed(){return 100+(state.level-1)*70}
function addXP(n){state.xp+=n;while(state.xp>=xpNeed()){state.xp-=xpNeed();state.level++;toast(`🎉 Bạn đã lên Lv.${state.level}!`);confetti(); if(state.level>=3 && !state.unlocked.includes("necklace")) state.unlocked.push("necklace","hairclip","bow","earring","bracelet")}}
function fmt(n){return n.toLocaleString("vi-VN")}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=msg;$("#toastLayer").appendChild(el);setTimeout(()=>el.remove(),2100)}
function floatText(txt){const e=document.createElement("div");e.className="float";e.textContent=txt;e.style.left=(35+Math.random()*30)+"%";e.style.top="47%";document.body.appendChild(e);setTimeout(()=>e.remove(),1000)}
function confetti(){["🎀","✨","💗","🌸","⭐","🩷","🛍️"].forEach((x,i)=>{const e=document.createElement("div");e.className="confetti";e.textContent=x;e.style.left=(25+Math.random()*50)+"%";e.style.top="42%";e.style.setProperty("--x",(Math.random()*240-120)+"px");e.style.setProperty("--y",(Math.random()*-220-40)+"px");document.body.appendChild(e);setTimeout(()=>e.remove(),1000)})}
function beep(type="click"){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext, c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=type==="coin"?720:type==="level"?900:420;o.type="sine";g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.08)}catch(e){}}
function shopUnlocked(cat){return cat!=="Phụ kiện" || state.level>=3}
function currentCustomer(){if(!activeCustomer){const c=CUSTOMERS[state.customerIndex%CUSTOMERS.length];const available=c.need.filter(id=>state.unlocked.includes(id));const p=PRODUCTS.find(x=>available.includes(x.id))||PRODUCTS[0];activeCustomer={...c,product:p.id,line:c.lines[Math.floor(Math.random()*c.lines.length)]}}return activeCustomer}
function render(){
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));
 const screen=$("#screen"); screen.innerHTML= state.tab==="home"?homeView():state.tab==="shops"?shopsView():state.tab==="stock"?stockView():state.tab==="quests"?questsView():settingsView();
 bind();
}
function headerStats(){return `<div class="stats">
 <div class="stat">🪙<b>${fmt(state.coins)}</b><span>Xu</span></div>
 <div class="stat">👥<b>${fmt(state.customers)}</b><span>Khách</span></div>
 <div class="stat">⭐<b>${fmt(state.reputation)}</b><span>Uy tín</span></div>
 <div class="stat">Lv.<b>${state.level}</b><span>EXP ${state.xp}/${xpNeed()}</span></div>
 </div>`}
function homeView(){
 const c=currentCustomer(), p=PRODUCTS.find(x=>x.id===c.product), has=(state.stock[p.id]||0)>0;
 const q=state.quest;
 return `<section class="hero"><div class="row"><div><b>🎀 Tiệm Mốt</b><div class="muted">Trung tâm mua sắm chibi</div></div><div class="reward">Lv.${state.level}</div></div>${headerStats()}<div style="margin-top:12px"><div class="row"><span class="muted">EXP lên Lv.${state.level+1}</span><b class="muted">${state.xp}/${xpNeed()}</b></div><div class="progress"><i style="width:${Math.min(100,state.xp/xpNeed()*100)}%"></i></div></div></section>
 <div class="section-title">🏬 KHU MUA SẮM <button data-tab="shops">Xem shop</button></div>${shopCards()}
 <div class="section-title">💌 Khách đang chờ</div>
 <div class="customer"><div class="avatar">${c.avatar}</div><div style="min-width:0"><h3>${c.name}</h3><div class="bubble">💬 ${c.line}</div><div class="muted" style="margin-top:4px">Cần: ${p.icon} ${p.name} · ${has?`còn ${state.stock[p.id]} SL`:"hết hàng"}</div></div><button class="sell-btn" data-sell="${p.id}" ${has?"":"disabled"}>${has?"✨ Bán món":"Hết hàng"}</button></div>
 <div class="section-title">🎯 NHIỆM VỤ HÔM NAY</div><div class="card"><div class="row"><div><b>👛 Bán ${q.target} món</b><div class="muted">${q.progress}/${q.target}</div></div><div class="reward">🎁 +${q.reward} Xu</div></div><div class="progress" style="margin-top:9px"><i style="width:${Math.min(100,q.progress/q.target*100)}%"></i></div>${q.done?'<div style="margin-top:9px;color:#50a77a;font-size:11px;font-weight:900">✓ đã nhận thưởng</div>':""}</div>
 <div class="section-title">🌷 NÂNG CẤP</div>${upgradeCards()}</section>`;
}
function shopCards(){
 const data=[
  ["pink","👗","Tiệm Váy","Quần áo","Quần áo"],
  ["blue","👜","Túi Xinh","Túi xách","Túi"],
  ["yellow","👟","Góc Giày","Giày dép","Giày"],
  ["lav","💎","Phụ Kiện","Trang sức / phụ kiện","Phụ kiện"]
 ];
 return `<div class="shops-grid">${data.map(([cl,ic,n,d,cat])=>{const open=shopUnlocked(cat);return `<div class="shop-card ${cl}">${!open?'<span class="lock">🔒 Lv.3</span>':""}<div class="shop-icon">${ic}</div><div class="shop-name">${n}</div><div class="shop-desc">${d}</div>${open?`<button class="shop-action" data-cat="${cat}">Xem hàng →</button>`:""}</div>`}).join("")}</div>`
}
function upgradeCards(){
 const list=[
  ["decor","🌸","Trang trí",120,"tăng Uy tín +2 mỗi lần","reputation"],
  ["ads","📣","Quảng bá",180,"tăng lượng khách","customers"],
  ["floor2","🏗️","Tầng 2",500,"mở rộng trung tâm · yêu cầu Lv.3","floor"]
 ];
 return list.map(([id,ic,n,cost,desc])=>{const lv=state.upgrades[id]||0;const locked=id==="floor2"&&state.level<3;return `<button class="upgrade" data-upgrade="${id}" ${locked?"disabled":""}><span class="emoji">${ic}</span> <strong>${n} ${lv?`Lv.${lv}`:""}</strong><span class="price">🪙 ${cost}</span><small>${locked?"🔒 cần Lv.3":desc}</small></button>`}).join("")
}
function shopsView(){return `<div class="section-title">🛍️ CỬA HÀNG</div>${shopCards()}<div class="card" style="margin-top:12px"><b>💡 mẹo nhỏ</b><div class="muted" style="margin-top:4px">bán đúng món khách cần để kiếm Xu, EXP và Uy tín. shop phụ kiện mở từ Lv.3.</div></div>`}
function stockView(){
 const cats=["Tất cả","Quần áo","Túi","Giày","Phụ kiện"];let list=PRODUCTS.filter(p=>state.unlocked.includes(p.id)&&(stockCat==="Tất cả"||p.cat===stockCat));
 return `<div class="section-title">🎒 KHO HÀNG <span class="muted">${list.length} sản phẩm</span></div><div class="tabs">${cats.map(c=>`<button class="tab ${stockCat===c?"active":""}" data-stockcat="${c}">${c}</button>`).join("")}</div><div class="stock-grid">${list.map(p=>`<div class="product"><div class="product-icon">${p.icon}</div><h4>${p.name}</h4><div class="meta">Bán 🪙 ${p.price} · Nhập 🪙 ${p.cost}</div><div class="row" style="margin-top:5px"><b>SL: ${state.stock[p.id]||0}</b><span class="muted">${p.cat}</span></div><div class="stock-actions"><button class="mini buy" data-buy="${p.id}">+ Nhập</button></div></div>`).join("")}</div>`
}
function questsView(){const q=state.quest;return `<div class="section-title">🎯 NHIỆM VỤ HÔM NAY</div><div class="card"><div class="row"><div style="font-size:25px">👛</div><div style="flex:1"><b>Bán ${q.target} món</b><div class="muted">Mỗi lần bán giúp tiến độ tăng lên.</div></div><div class="reward">🎁 +${q.reward}</div></div><div class="progress" style="margin-top:12px"><i style="width:${Math.min(100,q.progress/q.target*100)}%"></i></div><div class="row" style="margin-top:7px"><span class="muted">${q.progress}/${q.target}</span>${q.done?'<b style="color:#55a878">✓ Hoàn thành</b>':""}</div>${q.progress>=q.target&&!q.done?'<button class="big-btn" data-claim>🎁 Nhận thưởng</button>':""}</div><div class="card"><b>⭐ mục tiêu tiếp theo</b><div class="muted" style="margin-top:6px">tích lũy Xu, nâng cấp shop và lên level để mở thêm hàng mới.</div></div>`}
function settingsView(){return `<div class="section-title">⚙️ CÀI ĐẶT</div><div class="card"><div class="row"><div><b>🔊 Âm thanh</b><div class="muted">click, nhận Xu, nhiệm vụ, lên level</div></div><button class="shop-action" id="soundToggle">${state.sound?"Đang bật":"Đang tắt"}</button></div></div><div class="card"><b>💾 Dữ liệu game</b><div class="muted" style="margin:6px 0">game tự lưu bằng localStorage trên thiết bị này.</div><button class="big-btn" data-reset>↻ Chơi lại từ đầu</button></div><div class="card"><b>📱 PWA</b><div class="muted" style="margin-top:6px">sau khi host bằng HTTPS, em có thể dùng Safari → Chia sẻ → Thêm vào Màn hình chính để mở như app.</div></div>`}
function bind(){
 document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;save();render();beep()});
 document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;save();render()});
 document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{stockCat=b.dataset.cat;state.tab="stock";save();render()});
 document.querySelectorAll("[data-stockcat]").forEach(b=>b.onclick=()=>{stockCat=b.dataset.stockcat;render()});
 document.querySelectorAll("[data-sell]").forEach(b=>b.onclick=()=>sell(b.dataset.sell));
 document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buyStock(b.dataset.buy));
 document.querySelectorAll("[data-upgrade]").forEach(b=>b.onclick=()=>upgrade(b.dataset.upgrade));
 document.querySelector("[data-claim]")?.addEventListener("click",claimQuest);
 $("#soundToggle")?.addEventListener("click",()=>{state.sound=!state.sound;save();render()});
 $("#soundBtn").onclick=()=>{state.sound=!state.sound;save();render();toast(state.sound?"🔊 Đã bật âm thanh":"🔇 Đã tắt âm thanh")};
 document.querySelector("[data-reset]")?.addEventListener("click",()=>{if(confirm("xóa tiến trình và chơi lại từ đầu?")){state=structuredClone(DEFAULT);activeCustomer=null;save();render();toast("🌸 đã bắt đầu lại!")}})
}
function sell(id){
 const p=PRODUCTS.find(x=>x.id===id);if(!p||!state.stock[id]){toast("😿 món này đã hết hàng");return}
 state.stock[id]--;state.coins+=p.price;state.customers++;state.sold++;state.quest.progress=Math.min(state.quest.target,state.quest.progress+1);
 const repChance=Math.random()<.45; if(repChance)state.reputation+=1;
 addXP(25);
 if(state.upgrades.ads) state.customers+=Math.min(1,state.upgrades.ads);
 activeCustomer=null;save();floatText(`🪙 +${p.price} Xu`);beep("coin");
 if(repChance)toast(`🛍️ Bán được hàng! +${p.price} Xu · ⭐ +1 Uy tín`);else toast(`🛍️ Bán được hàng! +${p.price} Xu`);
 if(state.quest.progress>=state.quest.target&&!state.quest.done)toast("🎉 nhiệm vụ đã hoàn thành! nhận thưởng nhé");
 render();
}
function buyStock(id){const p=PRODUCTS.find(x=>x.id===id);if(state.coins<p.cost){toast("🪙 chưa đủ Xu");return}state.coins-=p.cost;state.stock[id]=(state.stock[id]||0)+1;save();beep();toast(`📦 đã nhập ${p.name}`);render()}
function upgrade(id){
 const costs={decor:120,ads:180,floor2:500};const cost=costs[id];if(id==="floor2"&&state.level<3){toast("🔒 cần Lv.3");return}if(state.coins<cost){toast("🪙 chưa đủ Xu");return}
 state.coins-=cost;state.upgrades[id]=(state.upgrades[id]||0)+1;
 if(id==="decor")state.reputation+=2;
 if(id==="ads")state.reputation+=1;
 if(id==="floor2"){state.reputation+=5;toast("🏗️ Tầng 2 đã mở rộng!");}
 addXP(45);save();confetti();beep("level");toast(`✨ ${id==="floor2"?"Nâng cấp hoàn tất!":"Nâng cấp thành công!"}`);render();
}
function claimQuest(){
 const q=state.quest;if(q.done||q.progress<q.target)return;state.coins+=q.reward;q.done=true;save();floatText(`🪙 +${q.reward} Xu`);confetti();beep("level");toast(`🎉 Hoàn thành nhiệm vụ! +${q.reward} Xu`);
 setTimeout(()=>{state.quest={target:5+Math.floor(state.sold/10)*2,progress:0,reward:100+Math.floor(state.sold/10)*25,done:false};save();render()},900);
}
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
render();
