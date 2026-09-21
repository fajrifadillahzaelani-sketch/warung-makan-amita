let menus=[],cart=[],menuMap=new Map();
const rupiah=n=>"Rp"+Number(n).toLocaleString("id-ID");
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const categoryImage={"Orang-orang pada Doyan":"/assets/menu/food-main.jpg","Resto Top Picks":"/assets/menu/food-main.jpg","Paket Nasi":"/assets/menu/nasi.jpg","Masakan Harian":"/assets/menu/vegetable.jpg","Varian Nasi":"/assets/menu/nasi.jpg","Ayam dan Ikan":"/assets/menu/ayam.jpg","Aneka Sambel":"/assets/menu/sambal.jpg","Karedok":"/assets/menu/vegetable.jpg","Makanan Pelengkap":"/assets/menu/food-main.jpg","Mie dan Nasi Goreng":"/assets/menu/food-main.jpg","Gorengan dan Lontong":"/assets/menu/grill.jpg","Minuman":"/assets/menu/drink.jpg","Aneka Pepes":"/assets/menu/vegetable.jpg","Taichan":"/assets/menu/grill.jpg"};
const categoryVisual={"Orang-orang pada Doyan":"🍽️","Resto Top Picks":"⭐","Paket Nasi":"🍱","Masakan Harian":"🍛","Varian Nasi":"🍚","Ayam dan Ikan":"🐟","Aneka Sambel":"🌶️","Karedok":"🥗","Makanan Pelengkap":"🥟","Mie dan Nasi Goreng":"🍜","Gorengan dan Lontong":"🥟","Minuman":"🥤","Aneka Pepes":"🍃","Taichan":"🍢"};
const categoryCounts={"Orang-orang pada Doyan":5,"Resto Top Picks":8,"Paket Nasi":29,"Masakan Harian":65,"Varian Nasi":5,"Ayam dan Ikan":24,"Aneka Sambel":8,"Karedok":3,"Makanan Pelengkap":6,"Mie dan Nasi Goreng":6,"Gorengan dan Lontong":10,"Minuman":17,"Aneka Pepes":7,"Taichan":1};
async function loadCategories(){const cats=await fetch('/api/kategori').then(r=>r.json());const ordered=Object.keys(categoryCounts).filter(c=>cats.includes(c));categoryFilter.innerHTML='<option value="">Semua kategori</option>'+ordered.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');categoryCards.innerHTML=ordered.map(c=>`<button class="category-card" data-category="${esc(c)}"><div class="category-art"><img src="${categoryImage[c]||'/assets/menu/food-main.jpg'}" alt="${esc(c)}" loading="lazy"><span>${categoryVisual[c]||'🍴'}</span></div><div class="category-name"><b>${esc(c)}</b><small>(${categoryCounts[c]||0})</small></div></button>`).join('');categoryCards.querySelectorAll('.category-card').forEach(b=>b.onclick=()=>{categoryFilter.value=b.dataset.category;document.querySelectorAll('.category-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');loadMenu();document.getElementById('menu').scrollIntoView({behavior:'smooth'});});categoryCountLabel.textContent=Object.values(categoryCounts).reduce((a,b)=>a+b,0)+' pilihan';}
async function loadMenu(){
  const q=searchMenu.value.trim(),k=categoryFilter?.value||'';
  const url='/api/menu?q='+encodeURIComponent(q)+'&kategori='+encodeURIComponent(k);
  try{
    const r=await fetch(url);
    if(!r.ok)throw new Error('Server menu gagal');
    menus=await r.json();
    menus.forEach(m=>menuMap.set(m.id,m));
    renderMenus();
  }catch(e){
    menuList.innerHTML='<div class="empty"><h3>Menu belum bisa dimuat</h3><p>Pastikan server Node.js sedang berjalan dengan <b>npm start</b>.</p></div>';
  }
}
function renderMenus(){
  menuList.innerHTML=menus.map(m=>`<article class="food-card" data-id="${m.id}" onclick="selectFoodCard(event,${m.id})">
    <div class="food-photo"><img src="${esc(m.gambar||'/assets/menu/food-main.jpg')}" alt="${esc(m.nama)}" loading="lazy"><i>MENU AMITA</i></div>
    <div class="food-body"><small>${esc(m.kategori)}</small><h3>${esc(m.nama)}</h3><div class="price-row"><p class="price">${rupiah(m.harga)}</p><span class="ready-badge">Tersedia</span></div><button class="add-btn" onclick="event.stopPropagation();addToCart(${m.id})">＋ Tambah Pesanan</button></div>
  </article>`).join('')||'<div class="empty">Menu tidak ditemukan.</div>';
}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function selectFoodCard(event,id){if(event.target.closest('button'))return;const card=event.currentTarget;card.classList.remove('selected');void card.offsetWidth;card.classList.add('selected');addToCart(id);}
function showToast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1600);}
function addToCart(id){
  const item=cart.find(x=>x.menu_id===id);
  if(item)item.jumlah++;
  else{const m=menuMap.get(id);if(!m)return;cart.push({menu_id:id,jumlah:1,nama:m.nama,harga:m.harga});}
  renderCart();
  const card=document.querySelector(`.food-card[data-id="${id}"]`);
  if(card){card.classList.remove('clicked');void card.offsetWidth;card.classList.add('clicked');}
  showToast('Menu ditambahkan ke keranjang ✓');
}
function changeQty(id,amount){const item=cart.find(x=>x.menu_id===id);if(!item)return;item.jumlah+=amount;if(item.jumlah<=0)cart=cart.filter(x=>x.menu_id!==id);renderCart();}
function renderCart(){const count=cart.reduce((s,x)=>s+x.jumlah,0);cartCount.textContent=count;if(!cart.length){cartItems.innerHTML='<p>Keranjang masih kosong.</p>';cartTotal.textContent='Rp0';return;}let total=0;cartItems.innerHTML=cart.map(item=>{const subtotal=item.harga*item.jumlah;total+=subtotal;return `<div class="cart-item"><div><strong>${esc(item.nama)}</strong><br>${rupiah(item.harga)} × ${item.jumlah}</div><div class="qty"><button onclick="changeQty(${item.menu_id},-1)">−</button><button onclick="changeQty(${item.menu_id},1)">+</button></div></div>`}).join('');cartTotal.textContent=rupiah(total);}
function openTrack(){trackModal.style.display='block';trackId.focus();}
cartBtn.onclick=()=>cartModal.style.display='block';closeCart.onclick=()=>cartModal.style.display='none';navTrack.onclick=e=>{e.preventDefault();openTrack();};closeTrack.onclick=()=>trackModal.style.display='none';document.querySelectorAll('.pill').forEach(p=>p.onclick=()=>{document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));p.classList.add('active');if(p.dataset.kind==='drink')categoryFilter.value='Minuman';else if(p.dataset.kind==='food')categoryFilter.value='';else categoryFilter.value='';loadMenu();});
searchMenu.addEventListener('input',loadMenu);categoryFilter.addEventListener('change',()=>{document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));loadMenu();});
showAll.onclick=e=>{e.preventDefault();searchMenu.value='';categoryFilter.value='';document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));document.querySelector('.pill[data-kind="all"]').classList.add('active');loadMenu();};
orderBtn.onclick=async()=>{if(!cart.length)return alert('Keranjang masih kosong.');const nama_pelanggan=nama.value.trim(),nomor_hp=hp.value.trim(),alamat=document.getElementById('alamat').value.trim();if(!nama_pelanggan||!nomor_hp||!alamat)return alert('Nama, nomor HP, dan alamat wajib diisi.');const items=cart.map(x=>({menu_id:x.menu_id,jumlah:x.jumlah}));const r=await fetch('/api/pesanan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nama_pelanggan,nomor_hp,alamat,items})}),d=await r.json();if(!r.ok)return alert(d.error||'Pesanan gagal disimpan.');alert(`Pesanan #${d.id} berhasil disimpan. Simpan nomor pesanan ini untuk mengecek status.`);trackId.value=d.id;trackHp.value=nomor_hp;cart=[];renderCart();cartModal.style.display='none';nama.value='';hp.value='';alamat.value='';openTrack();};
checkOrderBtn.onclick=async()=>{trackResult.innerHTML='Memuat...';const id=trackId.value.trim(),hpv=trackHp.value.trim();if(!id||!hpv){trackResult.innerHTML='<p>Nomor pesanan dan nomor HP wajib diisi.</p>';return;}const r=await fetch(`/api/pesanan/${encodeURIComponent(id)}/status?nomor_hp=${encodeURIComponent(hpv)}`),d=await r.json();if(!r.ok){trackResult.innerHTML=`<p class="error">${esc(d.error||'Pesanan tidak ditemukan.')}</p>`;return;}trackResult.innerHTML=`<div class="status-box"><h3>Pesanan #${d.id}</h3><p><b>Status:</b> <span class="status ${d.status.toLowerCase()} ">${esc(d.status)}</span></p><p>${esc(d.nama_pelanggan)} • ${esc(d.dibuat_pada)}</p><ul>${d.items.map(i=>`<li>${esc(i.nama)} × ${i.jumlah} = ${rupiah(i.subtotal)}</li>`).join('')}</ul><strong>Total: ${rupiah(d.total)}</strong></div>`;};
loadCategories();loadMenu();renderCart();
