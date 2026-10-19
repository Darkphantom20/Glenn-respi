/* ============================================================
 * ui-shop.js — customer-facing shop.
 * ============================================================ */

function shopShell() {
  const all = postedProducts();
  const totalKg = all.reduce((s, p) => s + num(p.stock_kg), 0);
  const varieties = new Set(all.map(p => p.variety)).size;
  const varietyOptions = [...new Set([
    ...CFG.varieties,
    ...state.products.map(p => p.variety).filter(Boolean)
  ])];

  return `
  <header class="topbar">
    <div class="wrap">
      <a class="logo" data-act="home">
        <span class="mark"><img class="brand-image" src="happy-cute-farmer-hold-dry-rice-banner-logo-cartoon-art-illustration_979495-143796.avif" alt=""></span>
        <span>${esc(shopName())}<small>Rice Shop</small></span>
      </a>
      <nav class="topnav">
        <a class="on" data-act="home">Shop</a>
       <a data-act="scroll" data-target="#riceSection">Among Bugas</a>
       <a data-act="scroll" data-target="#whySection">Nganong Kami?</a>

      </nav>
      <div class="spacer"></div>
      <button class="btn ghost sm" data-act="admin-open">${supa ? ' Owner Dashboard' : ' Connect Shop'}</button>
    </div>
  </header>

  <section class="hero">
    <div class="wrap">
      <div>
        <h1>De-kalidad nga bugas,<br>ibaligya kada kilo.</h1>
        <p>${esc(shopTagline())}Mag-order online, kuhaa sa among tindahan, o ipa-abot diretso sa inyong balay.</p>

        <div class="hero-cta">
         <button class="btn gold" data-act="scroll" data-target="#riceSection">🛒 Tan-awa among bugas</button>
<button class="btn ghost" data-act="scroll" data-target="#whySection">Pagkat-on pa</button>
        </div>
        <div class="hero-stats">
        <div><strong>${all.length}</strong><span>Mga klase sa bugas</span></div>
<div><strong>${varieties}</strong><span>Mga tipo nga naa sa tindahan</span></div>
<div><strong>${totalKg.toLocaleString()} kg</strong><span>Andam nga ipadala</span></div>

        </div>
      </div>
      <div class="hero-card">
        <h4>Nganong Kami Man?</h4>
        <ul>
  <li><span>🌾</span><span>Bag-ong galing matag semana — dili karaan nga stock</span></li>
  <li><span>⚖️</span><span>Tinuod nga timbang, garantiya nga eksakto ang kilo</span></li>
  <li><span>🚚</span><span>Libre ang delivery sa order nga molapas sa ${money(state.settings.free_delivery_over)}</span></li>
  <li><span>💬</span><span>Mag-order online, among kumpirmahon pinaagi sa tawag</span></li>
</ul>
      </div>
    </div>
  </section>

  <section class="section" id="riceSection">
    <div class="wrap">
      <div class="section-head">
        <div>
          <h2>Mga Bugas</h2>
          <p class="muted">Tanang klase nga bugas nga gi-post sa tag-iya sa tindahan.</p>

        </div>
        <div class="tools">
          <input class="input search" id="shopSearch" placeholder="Search rice…" value="${esc(state.filter.q)}">
          <select class="input" id="shopVariety">
            <option value="all">All varieties</option>
            ${varietyOptions.map(v => `<option value="${esc(v)}" ${state.filter.variety === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
          <select class="input" id="shopSort">
            <option value="featured"   ${state.filter.sort === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="price-asc"  ${state.filter.sort === 'price-asc' ? 'selected' : ''}>Price: low → high</option>
            <option value="price-desc" ${state.filter.sort === 'price-desc' ? 'selected' : ''}>Price: high → low</option>
            <option value="name"       ${state.filter.sort === 'name' ? 'selected' : ''}>Name A → Z</option>
          </select>
        </div>
      </div>
      <div class="cards" id="shopGrid"></div>
    </div>
  </section>

  <section class="section" id="whySection" style="padding-top:0">
    <div class="wrap">
      <div class="panel" style="padding:30px">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:26px">
          <div>
            <div style="font-size:28px">📦</div>
            <h4 style="margin:8px 0 4px">Unsaon Pag-order</h4>
            <p class="muted" style="margin:0;font-size:13.5px">Pili ug klase sa bugas, isulod ang kilo nga imong gikinahanglan, ug ipadala ang order. Among kumpirmahon pinaagi sa tawag.</p>
          </div>
          <div>
            <div style="font-size:28px">🏪</div>
            <h4 style="margin:8px 0 4px">Pickup o Delivery</h4>
            <p class="muted" style="margin:0;font-size:13.5px">Pili ug pickup sa ${esc(shopAddress())}, o delivery nga adunay flat fee nga ${money(state.settings.delivery_fee)}.</p>
          </div>
          <div>
            <div style="font-size:28px">💵</div>
            <h4 style="margin:8px 0 4px">Pagbayad sa Pagkuha</h4>
            <p class="muted" style="margin:0;font-size:13.5px">Cash on pickup o delivery. Wala’y online payment </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="wrap">
      <div>
        <strong>${esc(shopName())} Rice Shop</strong>
        ${esc(shopAddress())} · ${esc(shopPhone())}
      </div>
      <div>© ${new Date().getFullYear()} ${esc(shopName())}.</div>
    </div>
  </footer>`;
}

function renderShopGrid() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  let list = postedProducts();
  const q = state.filter.q.trim().toLowerCase();
  if (q) list = list.filter(p =>
    (p.name + ' ' + p.variety + ' ' + (p.grade || '') + ' ' + (p.description || ''))
      .toLowerCase().includes(q));
  if (state.filter.variety !== 'all') list = list.filter(p => p.variety === state.filter.variety);

  const sort = state.filter.sort;
  list.sort((a, b) => {
    if (sort === 'price-asc')  return num(a.price_per_kg) - num(b.price_per_kg);
    if (sort === 'price-desc') return num(b.price_per_kg) - num(a.price_per_kg);
    return String(a.name).localeCompare(String(b.name));
  });

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">
      <span class="big">🌾</span>
      <strong>${supa ? 'No rice found' : 'The shop is getting ready'}</strong><br>
      <span class="muted">${supa ? 'Try a different search or variety.' : 'The owner needs to connect the shop before products can appear.'}</span>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const st = stockInfo(p);
    return `
    <article class="pcard">
      <div class="thumb" data-thumb>
        ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" data-img>` : ''}
        <span class="fallback">${esc(p.name)}</span>
        <span class="tag">${esc(p.grade || 'Rice')}</span>
      </div>
      <div class="pbody">
        <h3>${esc(p.name)}</h3>
        <div class="pmeta">
          <span class="badge green">${esc(p.variety)}</span>
          ${p.origin ? `<span class="badge">${esc(p.origin)}</span>` : ''}
        </div>
        <p class="pdesc">${esc(p.description || 'Freshly milled rice sold by the kilo.')}</p>
        <div class="prow">
          <div>
            <div class="price">${money(p.price_per_kg)}<small> /kg</small></div>
            <div class="stock ${st.cls}">${esc(st.label)}</div>
          </div>
          <button class="btn sm" data-act="buy" data-id="${p.id}" ${st.canBuy ? '' : 'disabled'}>
            ${st.canBuy ? '🛒 Buy' : 'Sold out'}
          </button>
        </div>
      </div>
    </article>`;
  }).join('');

  attachImageFallbacks(grid);
}