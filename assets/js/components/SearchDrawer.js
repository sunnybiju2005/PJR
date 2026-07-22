/* PJR Instant Search & Multi-Filter Drawer Component */
import { store } from '../state.js';

/** Helper to render search result items */
function renderSearchResultsList(products) {
  if (!products || products.length === 0) {
    return `<p style="font-size:0.9rem; color:var(--pjr-steel-grey); padding:1rem 0;">No matching items found for your search.</p>`;
  }

  return products.map(p => {
    const img = (p.images || p.imageUrls || [])[0] || 'assets/images/hero-men.png';
    return `
      <div class="search-item-row quick-view-btn" data-qv-id="${p.id}"
        style="display:flex; align-items:center; gap:0.85rem; padding:0.6rem; border-radius:var(--radius-xs); cursor:pointer; transition:background 0.2s ease; border-bottom:1px solid rgba(0,0,0,0.05);">
        <img src="${img}" alt="${p.title}" style="width:48px; height:60px; object-fit:cover; border-radius:4px; background:var(--pjr-bg-grey);" />
        <div style="flex:1;">
          <div style="font-size:0.75rem; color:var(--pjr-teal); font-weight:700;">${p.brand}</div>
          <div style="font-size:0.9rem; font-weight:600; color:var(--pjr-deep-navy);">${p.title}</div>
          <div style="font-size:0.85rem; font-weight:700; color:var(--pjr-dark-slate);">₹${p.price ? p.price.toLocaleString('en-IN') : '0'}</div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderSearchDrawer() {
  const isOpen = store.activeModal === 'search';
  const filteredProducts = store.getFilteredProducts();

  return `
    <div class="drawer-overlay ${isOpen ? 'active' : ''}" id="searchDrawerOverlay">
      <div class="drawer-content" id="searchDrawer" style="max-width:520px;">
        <div class="drawer-header">
          <h3 style="margin:0; font-size:1.3rem;">Search &amp; Filter</h3>
          <button class="close-btn" id="closeSearchDrawer">✕</button>
        </div>

        <div class="drawer-body">
          <!-- Instant Search Input -->
          <div class="form-group" style="position:relative; margin-bottom:1.5rem;">
            <input
              type="text"
              class="form-input"
              id="liveSearchInput"
              value="${store.filters.search || ''}"
              placeholder="Search products, brands (e.g. Blazer, Silk, Zara)..."
              style="padding-left:2.5rem; font-size:1rem; height:46px;"
              autocomplete="off"
            />
            <svg width="18" height="18" fill="none" stroke="var(--pjr-steel-grey)" stroke-width="2" viewBox="0 0 24 24" style="position:absolute; left:0.85rem; top:0.85rem;"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <!-- Gender Tabs -->
          <div class="form-group">
            <label class="form-label">Target Gender</label>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'all' ? 'active' : ''}" data-filter-type="gender" data-val="all" style="padding:0.4rem 0.8rem; font-size:0.85rem;">All</button>
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'men' ? 'active' : ''}" data-filter-type="gender" data-val="men" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Men</button>
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'women' ? 'active' : ''}" data-filter-type="gender" data-val="women" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Women</button>
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'accessories' ? 'active' : ''}" data-filter-type="gender" data-val="accessories" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Accessories</button>
            </div>
          </div>

          <!-- Brand Selector -->
          ${store.brands && store.brands.length > 0 ? `
            <div class="form-group">
              <label class="form-label">Fashion Brand</label>
              <div class="search-brands-grid">
                ${store.brands.slice(0, 4).map(b => `
                  <button class="search-brand-btn" data-brand="${b.name.toLowerCase()}">${b.name}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Sort Selector -->
          <div class="form-group">
            <label class="form-label">Sort By</label>
            <select class="form-input" id="sortSelect">
              <option value="newest" ${store.filters.sortBy === 'newest' ? 'selected' : ''}>Newest Arrivals</option>
              <option value="price-low" ${store.filters.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${store.filters.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${store.filters.sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
            </select>
          </div>

          <!-- Instant Suggestions List -->
          <div style="margin-top:1.5rem; border-top:1px solid var(--pjr-light-grey); padding-top:1.25rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--pjr-teal); text-transform:uppercase; margin-bottom:0.75rem;" id="searchCountHeader">
              Matching Results (${filteredProducts.length})
            </div>

            <div style="display:flex; flex-direction:column; gap:0.5rem;" id="searchResultsListContainer">
              ${renderSearchResultsList(filteredProducts)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let searchDebounceTimer = null;

export function initSearchEvents() {
  // Global Delegation for Search Drawer Controls
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeSearchDrawer' || e.target.id === 'searchDrawerOverlay') {
      store.closeModal();
      return;
    }

    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
      const type = filterBtn.dataset.filterType;
      const val = filterBtn.dataset.val;
      store.setFilter(type, val);
      return;
    }

    const brandBtn = e.target.closest('.search-brand-btn');
    if (brandBtn) {
      const brandVal = brandBtn.dataset.brand;
      store.setFilter('brand', brandVal);
      return;
    }
  });

  // Debounced input typing handler: NEVER destroys input DOM node, updates results dynamically
  document.addEventListener('input', (e) => {
    if (e.target.id === 'liveSearchInput') {
      const queryVal = e.target.value;

      // Update filter value in state without triggering global app re-render
      store.filters.search = queryVal;

      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        const filtered = store.getFilteredProducts();
        
        // Dynamically update search results container without losing input focus
        const listEl = document.getElementById('searchResultsListContainer');
        const countHeader = document.getElementById('searchCountHeader');

        if (listEl) {
          listEl.innerHTML = renderSearchResultsList(filtered);
        }
        if (countHeader) {
          countHeader.textContent = `Matching Results (${filtered.length})`;
        }
      }, 120); // 120ms smooth debounce
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'sortSelect') {
      store.setFilter('sortBy', e.target.value);
    }
  });
}
