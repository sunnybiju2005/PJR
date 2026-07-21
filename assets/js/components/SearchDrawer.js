/* PJR Instant Search & Multi-Filter Drawer Component */
import { store } from '../state.js';
import { BRANDS } from '../mockData.js';

export function renderSearchDrawer() {
  const isOpen = store.activeModal === 'search';
  const filteredProducts = store.getFilteredProducts();

  return `
    <div class="drawer-overlay ${isOpen ? 'active' : ''}" id="searchDrawerOverlay">
      <div class="drawer-content" id="searchDrawer" style="max-width:520px;">
        <div class="drawer-header">
          <h3 style="margin:0; font-size:1.3rem;">Search & Filter</h3>
          <button class="close-btn" id="closeSearchDrawer">✕</button>
        </div>

        <div class="drawer-body">
          <!-- Instant Search Input -->
          <div class="form-group" style="position:relative; margin-bottom:1.5rem;">
            <input type="text" class="form-input" id="liveSearchInput" value="${store.filters.search}" placeholder="Search products, brands (e.g. Blazer, Silk, Zara)..." style="padding-left:2.5rem; font-size:1rem;" />
            <svg width="18" height="18" fill="none" stroke="var(--pjr-steel-grey)" stroke-width="2" viewBox="0 0 24 24" style="position:absolute; left:0.85rem; top:0.85rem;"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <!-- Gender Tabs -->
          <div class="form-group">
            <label class="form-label">Target Gender</label>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'all' ? 'active' : ''}" data-filter-type="gender" data-val="all" style="padding:0.4rem 0.8rem; font-size:0.85rem;">All</button>
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'men' ? 'active' : ''}" data-filter-type="gender" data-val="men" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Men</button>
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'women' ? 'active' : ''}" data-filter-type="gender" data-val="women" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Women</button>
              <button class="btn btn-outline filter-btn ${store.filters.gender === 'accessories' ? 'active' : ''}" data-filter-type="gender" data-val="accessories" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Accessories</button>
            </div>
          </div>

          <!-- Brand Selector -->
          <div class="form-group">
            <label class="form-label">Fashion Brand</label>
            <select class="form-input" id="brandSelect">
              <option value="all">All Designer Houses</option>
              ${BRANDS.map(b => `
                <option value="${b.name}" ${store.filters.brand.toLowerCase() === b.name.toLowerCase() ? 'selected' : ''}>${b.name}</option>
              `).join('')}
            </select>
          </div>

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
          <div style="margin-top:2rem; border-top:1px solid var(--pjr-light-grey); padding-top:1.25rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--pjr-teal); text-transform:uppercase; margin-bottom:1rem;">
              Matching Results (${filteredProducts.length})
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              ${filteredProducts.length === 0 ? `
                <p style="font-size:0.9rem; color:var(--pjr-steel-grey);">No matching items found for your search.</p>
              ` : filteredProducts.map(p => `
                <div class="search-item-row quick-view-btn" data-qv-id="${p.id}" style="display:flex; items-center; gap:0.85rem; padding:0.5rem; border-radius:var(--radius-xs); cursor:pointer; transition:background 0.2s ease;">
                  <img src="${p.images[0]}" style="width:48px; height:60px; object-fit:cover; border-radius:4px;" />
                  <div style="flex:1;">
                    <div style="font-size:0.75rem; color:var(--pjr-teal); font-weight:700;">${p.brand}</div>
                    <div style="font-size:0.9rem; font-weight:600; color:var(--pjr-deep-navy);">${p.title}</div>
                    <div style="font-size:0.85rem; font-weight:700; color:var(--pjr-dark-slate);">₹${p.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSearchEvents() {
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
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'liveSearchInput') {
      store.setFilter('search', e.target.value);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'brandSelect') {
      store.setFilter('brand', e.target.value);
    }
    if (e.target.id === 'sortSelect') {
      store.setFilter('sortBy', e.target.value);
    }
  });
}
