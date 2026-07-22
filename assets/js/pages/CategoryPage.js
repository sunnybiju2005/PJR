/* PJR Dedicated Category Page Renderer (Men, Women, Accessories, Offers) */
import { store } from '../state.js';
import { renderProductCard } from '../components/ProductGrid.js';

export function renderCategoryPage(genderType) {
  if (['men', 'women', 'accessories'].includes(genderType)) {
    store.filters.gender = genderType;
  } else {
    store.filters.gender = 'all';
  }
  const filtered = store.getFilteredProducts();

  let subcategories = [];
  let pageTitle = 'Collection';
  let heroImg = 'assets/images/hero-men.png';

  if (genderType === 'men') {
    subcategories = store.subcategories.filter(s => s.parent === 'men');
    pageTitle = "Men's Luxury Fashion";
    heroImg = 'assets/images/hero-men.png';
  } else if (genderType === 'women') {
    subcategories = store.subcategories.filter(s => s.parent === 'women');
    pageTitle = "Women's Couture & Elegance";
    heroImg = 'assets/images/hero-women.png';
  } else if (genderType === 'accessories') {
    subcategories = store.subcategories.filter(s => s.parent === 'accessories');
    pageTitle = 'Luxury Accessories & Watches';
    heroImg = 'assets/images/hero-accessories.png';
  } else {
    pageTitle = genderType.toUpperCase().replace('-', ' ');
  }

  const isGrid = store.filters.viewMode === 'grid';
  
  // Count active filters (excluding default values)
  let activeFilterCount = 0;
  if (store.filters.brand !== 'all') activeFilterCount++;
  if (store.filters.subcategory !== 'all') activeFilterCount++;
  if (store.filters.priceMax < 30000) activeFilterCount++;
  if (store.filters.size !== 'all') activeFilterCount++;

  return `
    <!-- Category Page Banner -->
    <div class="category-banner" style="background:var(--pjr-deep-navy); color:var(--pjr-pure-white); padding:7.5rem 0 3rem; position:relative; overflow:hidden;">
      <div style="position:absolute; inset:0; opacity:0.25;">
        <img src="${heroImg}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      
      <div class="container" style="position:relative; z-index:2;">
        <div style="font-size:0.82rem; color:var(--pjr-teal-light); margin-bottom:0.5rem; font-weight:600;">
          <a href="index.html" style="color:var(--pjr-teal-light); text-decoration:none;">Home</a> &nbsp;/&nbsp; 
          <span style="color:var(--pjr-pure-white);">${pageTitle}</span>
        </div>

        <h1 style="color:var(--pjr-pure-white); margin-bottom:0.4rem; font-size:clamp(1.8rem, 5vw, 3rem);">${pageTitle}</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:580px; font-size:0.95rem; margin:0;">
          Discover precision tailoring, high-grade fabrics, and PJR's signature perfect fit system.
        </p>
      </div>
    </div>

    <!-- Subcategories Horizontal Pill Scroller -->
    ${subcategories.length > 0 ? `
      <div style="background:var(--pjr-bg-grey); border-bottom:1px solid var(--pjr-light-grey); padding:0.75rem 0;">
        <div class="container" style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.25rem; -webkit-overflow-scrolling:touch;">
          <button class="btn btn-outline subcat-pill-btn ${store.filters.subcategory === 'all' ? 'active' : ''}" data-subcat="all" style="padding:0.4rem 0.9rem; font-size:0.8rem; flex-shrink:0;">
            All
          </button>
          ${subcategories.map(sc => `
            <button class="btn btn-outline subcat-pill-btn ${store.filters.subcategory === sc.id ? 'active' : ''}" data-subcat="${sc.id}" style="padding:0.4rem 0.9rem; font-size:0.8rem; flex-shrink:0;">
              ${sc.name}
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <section class="section" style="padding: 1.5rem 0 4rem;">
      <div class="container">
        
        <!-- Compact Toolbar (Mobile Filter Button + Sort + View Toggle) -->
        <div class="catalog-toolbar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; gap:0.75rem; padding-bottom:0.85rem; border-bottom:1px solid var(--pjr-light-grey);">
          
          <!-- Mobile Filter Button (visible on mobile / desktop trigger) -->
          <button class="btn btn-teal mobile-filter-trigger-btn" id="openMobileFilterBtn" style="padding:0.5rem 1rem; font-size:0.82rem; display:inline-flex; align-items:center; gap:0.4rem;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filter ${activeFilterCount > 0 ? `<span class="badge badge-discount" style="padding:0.1rem 0.4rem; font-size:0.65rem;">${activeFilterCount}</span>` : ''}
          </button>

          <div style="font-weight:600; color:var(--pjr-steel-grey); font-size:0.85rem;" class="item-count-text">
            <strong>${filtered.length}</strong> items
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem;">
            <!-- Sort Selector -->
            <select class="form-input" id="categorySortSelect" style="padding:0.4rem 0.65rem; font-size:0.82rem; width:140px;">
              <option value="newest" ${store.filters.sortBy === 'newest' ? 'selected' : ''}>Newest</option>
              <option value="price-low" ${store.filters.sortBy === 'price-low' ? 'selected' : ''}>Price: Low-High</option>
              <option value="price-high" ${store.filters.sortBy === 'price-high' ? 'selected' : ''}>Price: High-Low</option>
              <option value="rating" ${store.filters.sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
            </select>

            <!-- View Mode Toggle -->
            <div style="display:flex; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-xs); overflow:hidden;">
              <button class="view-toggle-btn ${isGrid ? 'active' : ''}" data-view="grid" style="padding:0.35rem 0.6rem; border:none; background:${isGrid ? 'var(--pjr-deep-navy)' : 'transparent'}; color:${isGrid ? 'white' : 'var(--pjr-steel-grey)'}; cursor:pointer;" title="Grid view">
                ⬛
              </button>
              <button class="view-toggle-btn ${!isGrid ? 'active' : ''}" data-view="list" style="padding:0.35rem 0.6rem; border:none; background:${!isGrid ? 'var(--pjr-deep-navy)' : 'transparent'}; color:${!isGrid ? 'white' : 'var(--pjr-steel-grey)'}; cursor:pointer;" title="List view">
                ☰
              </button>
            </div>
          </div>
        </div>

        <!-- Layout Grid: Desktop Filter Sidebar + Product Cards Grid -->
        <div class="category-main-layout">
          
          <!-- Desktop Filter Sidebar (Hidden on mobile via CSS) -->
          <div class="desktop-filter-sidebar glass-card" style="padding:1.5rem; display:flex; flex-direction:column; gap:1.5rem; height:fit-content;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="font-size:0.9rem; margin:0; text-transform:uppercase; letter-spacing:0.08em; color:var(--pjr-teal); font-weight:700;">Filters</h4>
              ${activeFilterCount > 0 ? `<button class="btn btn-outline" id="resetCategoryFiltersBtnDesktop" style="padding:0.25rem 0.6rem; font-size:0.75rem;">Reset</button>` : ''}
            </div>

            <!-- Brand Filter -->
            <div>
              <label class="form-label" style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--pjr-teal);">Brand House</label>
              <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; max-height:180px; overflow-y:auto;">
                <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                  <input type="radio" name="brandFilterDesktop" value="all" ${store.filters.brand === 'all' ? 'checked' : ''} />
                  <span>All Brands</span>
                </label>
                ${store.brands.map(b => `
                  <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                    <input type="radio" name="brandFilterDesktop" value="${b.name}" ${store.filters.brand.toLowerCase() === b.name.toLowerCase() ? 'checked' : ''} />
                    <span>${b.name}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <label class="form-label" style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--pjr-teal);">Price Range</label>
              <input type="range" min="0" max="30000" step="1000" value="${store.filters.priceMax}" id="priceRangeSliderDesktop" style="width:100%; accent-color:var(--pjr-teal);" />
              <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--pjr-steel-grey); margin-top:0.3rem;">
                <span>₹0</span>
                <span>Max: <strong>₹${store.filters.priceMax.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          </div>

          <!-- Products Container -->
          <div class="category-products-container">
            ${filtered.length === 0 ? `
              <div style="text-align:center; padding:4rem 1rem; background:var(--pjr-bg-grey); border-radius:var(--radius-md);">
                <div style="font-size:3rem; margin-bottom:0.75rem;">🔍</div>
                <h3 style="color:var(--pjr-deep-navy); margin-bottom:0.4rem;">No products found</h3>
                <p class="text-muted" style="margin-bottom:1.25rem; font-size:0.9rem;">Try resetting your active filters or selecting another category.</p>
                <button class="btn btn-teal" id="clearFiltersBtn">Reset All Filters</button>
              </div>
            ` : `
              <div class="${isGrid ? 'grid-4' : 'list-view-container'}">
                ${filtered.map(p => renderProductCard(p)).join('')}
              </div>
            `}
          </div>

        </div>

      </div>
    </section>

    <!-- Slide-Up Filter Bottom Sheet Modal for Mobile -->
    <div class="drawer-overlay" id="filterBottomSheetModal" style="z-index:1250;" role="dialog" aria-modal="true" aria-label="Filter products">
      <div class="drawer-content" style="max-height:85vh; border-radius:var(--radius-lg) var(--radius-lg) 0 0; padding:1.25rem; display:flex; flex-direction:column;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid var(--pjr-light-grey); flex-shrink:0;">
          <div>
            <span style="font-size:0.68rem; font-weight:700; color:var(--pjr-teal); text-transform:uppercase; letter-spacing:0.12em;">REFINE SELECTION</span>
            <h3 style="margin:0; font-size:1.2rem; color:var(--pjr-deep-navy);">Filters</h3>
          </div>
          <button class="close-btn" id="closeFilterBottomSheetBtn">✕</button>
        </div>

        <div style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:1.5rem; padding-right:0.25rem;">
          
          <!-- Brand Filter -->
          <div>
            <h4 style="font-size:0.85rem; margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--pjr-teal);">Brand House</h4>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.5rem; font-size:0.85rem;">
              <label style="display:flex; align-items:center; gap:0.4rem; padding:0.5rem; background:var(--pjr-bg-grey); border-radius:var(--radius-xs); cursor:pointer;">
                <input type="radio" name="brandFilterMobile" value="all" ${store.filters.brand === 'all' ? 'checked' : ''} />
                <span>All Brands</span>
              </label>
              ${store.brands.map(b => `
                <label style="display:flex; align-items:center; gap:0.4rem; padding:0.5rem; background:var(--pjr-bg-grey); border-radius:var(--radius-xs); cursor:pointer;">
                  <input type="radio" name="brandFilterMobile" value="${b.name}" ${store.filters.brand.toLowerCase() === b.name.toLowerCase() ? 'checked' : ''} />
                  <span>${b.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Price Range Slider -->
          <div>
            <h4 style="font-size:0.85rem; margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--pjr-teal);">Max Price (₹)</h4>
            <input type="range" min="0" max="30000" step="1000" value="${store.filters.priceMax}" id="priceRangeSliderMobile" style="width:100%; accent-color:var(--pjr-teal);" />
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--pjr-steel-grey); margin-top:0.35rem;">
              <span>₹0</span>
              <span>Max: <strong>₹${store.filters.priceMax.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          <!-- Size Selector -->
          <div>
            <h4 style="font-size:0.85rem; margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--pjr-teal);">Size</h4>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${['S', 'M', 'L', 'XL', 'XXL'].map(s => `
                <button class="size-btn filter-size-btn ${store.filters.size === s ? 'active' : ''}" data-size="${s}">${s}</button>
              `).join('')}
            </div>
          </div>

        </div>

        <div style="padding-top:1rem; border-top:1px solid var(--pjr-light-grey); display:flex; gap:0.75rem; flex-shrink:0;">
          <button class="btn btn-outline" id="resetCategoryFiltersBtnMobile" style="flex:1;">Reset</button>
          <button class="btn btn-teal" id="applyMobileFiltersBtn" style="flex:2;">Apply Filters</button>
        </div>

      </div>
    </div>
  `;
}

export function initCategoryPageEvents() {
  document.addEventListener('click', (e) => {
    // Open mobile filter bottom sheet
    if (e.target.closest('#openMobileFilterBtn')) {
      const modal = document.getElementById('filterBottomSheetModal');
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
      return;
    }

    // Close mobile filter bottom sheet
    if (e.target.closest('#closeFilterBottomSheetBtn') || e.target.id === 'filterBottomSheetModal' || e.target.id === 'applyMobileFiltersBtn') {
      const modal = document.getElementById('filterBottomSheetModal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
      return;
    }

    // Subcategory pill buttons
    const subcatBtn = e.target.closest('.subcat-pill-btn');
    if (subcatBtn) {
      store.setFilter('subcategory', subcatBtn.dataset.subcat);
      return;
    }

    // View toggle grid / list
    const viewBtn = e.target.closest('.view-toggle-btn');
    if (viewBtn) {
      store.setFilter('viewMode', viewBtn.dataset.view);
      return;
    }

    // Reset filters
    if (e.target.id === 'resetCategoryFiltersBtnDesktop' || e.target.id === 'resetCategoryFiltersBtnMobile' || e.target.id === 'clearFiltersBtn') {
      store.resetFilters();
      const modal = document.getElementById('filterBottomSheetModal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.name === 'brandFilterDesktop' || e.target.name === 'brandFilterMobile') {
      store.setFilter('brand', e.target.value);
    }
    if (e.target.id === 'categorySortSelect') {
      store.setFilter('sortBy', e.target.value);
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'priceRangeSliderDesktop' || e.target.id === 'priceRangeSliderMobile') {
      store.setFilter('priceMax', parseInt(e.target.value, 10));
    }
  });
}
