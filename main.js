// FarmerCart - Common Functions
function doSearch(){
  let v = document.getElementById('searchBox').value;
  localStorage.setItem('fc_search', v);
  location.href = 'available.html';
}
function updateCart(){
  let c = JSON.parse(localStorage.getItem('fc_cart') || '[]');
  let n = c.reduce((a,b)=>a+b.qty,0);
  let el = document.getElementById('cartCount');
  if(el) el.innerText = n;
}
function addToCart(id){
  let products = JSON.parse(localStorage.getItem('fc_products') || '[]');
  let cart = JSON.parse(localStorage.getItem('fc_cart') || '[]');
  let p = products.find(x=>x.id==id);
  let ex = cart.find(x=>x.id==id);
  if(ex) ex.qty++;
  else cart.push({...p, qty:1});
  localStorage.setItem('fc_cart', JSON.stringify(cart));
  updateCart();
  alert('Added to Cart!');
}
function buyNow(id){ addToCart(id); location.href='cart.html'; }

// Product Listing Function - Used on all product pages
function renderList(CAT){
  let products = JSON.parse(localStorage.getItem('fc_products') || '[]');
  let q = (localStorage.getItem('fc_search') || '').toLowerCase();
  let sort = document.getElementById('sort') ? document.getElementById('sort').value : '';
  let pr = document.getElementById('filterPrice') ? document.getElementById('filterPrice').value : '';
  let list = products.filter(p=>{
    let okQ = p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    let okCat = !CAT || p.cat==CAT;
    let okPr = true;
    if(pr=='0-200') okPr = p.price<=200;
    if(pr=='200-500') okPr = p.price>200 && p.price<=500;
    if(pr=='500-99999') okPr = p.price>500;
    return okQ && okCat && okPr;
  });
  if(sort=='low') list.sort((a,b)=>a.price-b.price);
  if(sort=='high') list.sort((a,b)=>b.price-a.price);
  let g = document.getElementById('list');
  if(!g) return;
  g.innerHTML='';
  document.getElementById('count').innerText = list.length + ' Products Found';
  if(list.length==0){ g.innerHTML='<div class="card">No products found.</div>'; return; }
  list.forEach(p=>{
    g.innerHTML += `<div class="p-card"><div class="p-img">${p.emoji}</div><h4>${p.name}</h4><p>⭐ ${p.rating} | ${p.stock}</p><p><b>₹${p.price}</b> <s>₹${p.old}</s> <span style="color:green">${Math.round((1-p.price/p.old)*100)}% off</span></p><p>📞 Farmer: ${p.phone} | <a href="https://wa.me/91${p.phone}" target="_blank" style="color:green"><b>WhatsApp</b></a></p><button onclick="addToCart(${p.id})">Add to Cart</button><button onclick="buyNow(${p.id})">Buy Now</button></div>`;
  });
}
updateCart();