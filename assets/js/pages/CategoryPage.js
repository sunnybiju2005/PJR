/* PJR Dedicated Category Page Renderer (Men, Women, Accessories, Offers) */
import { store } from '../state.js';

import { renderProductCard } from '../components/ProductGrid.js';

export function renderCategoryPage(genderType) {
  store.filters.gender = genderType;
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

  return `
    <!-- Category Page Banner -->
    <div style="background:var(--pjr-deep-navy); color:var(--pjr-pure-white); padding:8rem 0 3.5rem; position:relative; overflow:hidden;">
      <div style="position:absolute; inset:0; opacity:0.25;">
        <img src="${heroImg}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      
      <div class="container" style="position:relative; z-index:2;">
        <!-- Breadcrumb -->
        <div style="font-size:0.85rem; color:var(--pjr-teal-light); margin-bottom:0.75rem; font-weight:600;">
          <a href="#home" style="color:var(--pjr-teal-light); text-decoration:none;">Home</a> &nbsp;/&nbsp; 
          <span style="color:var(--pjr-pure-white);">${pageTitle}</span>
        </div>

        <h1 style="color:var(--pjr-pure-white); margin-bottom:0.5rem; font-size:3rem;">${pageTitle}</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; font-size:1.05rem;">
          Discover precision tailoring, high-grade fabrics, and PJR's signature perfect fit system.
        </p>
      </div>
    </div>

    <!-- Subcategories Horizontal Pill Scroller -->
    ${subcategories.length > 0 ? `
      <div style="background:var(--pjr-bg-grey); border-bottom:1px solid var(--pjr-light-grey); padding:1rem 0; sticky:top:70px; z-index:800;">
        <div class="container" style="display:flex; gap:0.75rem; overflow-x:auto; padding-bottom:0.25rem;">
          <button class="btn btn-outline subcat-pill-btn ${store.filters.subcategory === 'all' ? 'active' : ''}" data-subcat="all" style="padding:0.45rem 1rem; font-size:0.85rem; flex-shrink:0;">
            All Categories
          </button>
          ${subcategories.map(sc => `
            <button class="btn btn-outline subcat-pill-btn ${store.filters.subcategory === sc.id ? 'active' : ''}" data-subcat="${sc.id}" style="padding:0.45rem 1rem; font-size:0.85rem; flex-shrink:0;">
              ${sc.name}
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <section class="section">
      <div class="container">
        <!-- Controls Bar (Filter toggle, Sort, Grid/List view) -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; padding-bottom:1rem; border-bottom:1px solid var(--pjr-light-grey);">
          <div style="font-weight:600; color:var(--pjr-steel-grey); font-size:0.95rem;">
            Showing <strong>${filtered.length}</strong> luxury pieces
          </div>

          <div style="display:flex; align-items:center; gap:1.25rem;">
            <!-- Sort Selector -->
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.88rem;">
              <label class="form-label" style="margin:0; font-weight:600;">Sort By:</label>
              <select class="form-input" id="categorySortSelect" style="padding:0.4rem 0.8rem; font-size:0.85rem; width:170px;">
                <option value="newest" ${store.filters.sortBy === 'newest' ? 'selected' : ''}>Newest Arrivals</option>
                <option value="price-low" ${store.filters.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${store.filters.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${store.filters.sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
              </select>
            </div>

            <!-- View Toggle -->
            <div style="display:flex; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-sm); overflow:hidden;">
              <button class="view-toggle-btn ${isGrid ? 'active' : ''}" data-view="grid" style="padding:0.4rem 0.75rem; border:none; background:${isGrid ? 'var(--pjr-deep-navy)' : 'transparent'}; color:${isGrid ? 'var(--pjr-pure-white)' : 'var(--pjr-steel-grey)'}; cursor:pointer;">
                ⬛ Grid
              </button>
              <button class="view-toggle-btn ${!isGrid ? 'active' : ''}" data-view="list" style="padding:0.4rem 0.75rem; border:none; background:${!isGrid ? 'var(--pjr-deep-navy)' : 'transparent'}; color:${!isGrid ? 'var(--pjr-pure-white)' : 'var(--pjr-steel-grey)'}; cursor:pointer;">
                ☰ List
              </button>
            </div>
          </div>
        </div>

        <!-- Main Product Grid & Filter Sidebar Layout -->
        <div style="display:grid; grid-template-columns: 240px 1fr; gap:2.5rem;">
          <!-- Filter Sidebar -->
          <div style="display:flex; flex-direction:column; gap:1.75rem;">
            <!-- Brand Filter -->
            <div>
              <h4 style="font-size:0.95rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--pjr-teal);">Brand House</h4>
              <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.88rem;">
                <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                  <input type="radio" name="brandFilter" value="all" ${store.filters.brand === 'all' ? 'checked' : ''} />
                  <span>All Brands</span>
                </label>
                ${store.brands.map(b => `
                  <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                    <input type="radio" name="brandFilter" value="${b.name}" ${store.filters.brand.toLowerCase() === b.name.toLowerCase() ? 'checked' : ''} />
                    <span>${b.name}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Price Filter Slider -->
            <div>
              <h4 style="font-size:0.95rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--pjr-teal);">Price Range</h4>
              <input type="range" min="0" max="30000" step="1000" value="${store.filters.priceMax}" id="priceRangeSlider" style="width:100%; accent-color:var(--pjr-teal);" />
              <div style="display:flex; justify-space-between; font-size:0.8rem; color:var(--pjr-steel-grey); margin-top:0.4rem;">
                <span>₹0</span>
                <span>Max: <strong>₹${store.filters.priceMax.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            <!-- Size Selector -->
            <div>
              <h4 style="font-size:0.95rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--pjr-teal);">Size</h4>
              <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                ${['S', 'M', 'L', 'XL', 'XXL'].map(s => `
                  <button class="size-btn filter-size-btn ${store.filters.size === s ? 'active' : ''}" data-size="${s}">${s}</button>
                `).join('')}
              </div>
            </div>

            <button class="btn btn-outline" id="resetCategoryFiltersBtn" style="padding:0.5rem; font-size:0.8rem;">
              🔄 Reset All Filters
            </button>
          </div>

          <!-- Product Grid / List Container -->
          <div>
            ${filtered.length === 0 ? `
              <div style="text-align:center; padding:5rem 1rem; background:var(--pjr-bg-grey); border-radius:var(--radius-md);">
                <div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
                <h3 style="color:var(--pjr-deep-navy); margin-bottom:0.5rem;">No products found</h3>
                <p class="text-muted" style="margin-bottom:1.5rem;">Try adjusting your filters or subcategory selection.</p>
                <button class="btn btn-teal" id="clearFiltersBtn">Show All Items</button>
              </div>
            ` : `
              <div class="${isGrid ? 'grid-3' : 'list-view-container'}">
                ${filtered.map(p => renderProductCard(p)).join('')}
              </div>

              <!-- Pagination -->
              <div style="display:flex; justify-content:center; gap:0.5rem; margin-top:3.5rem;">
                <button class="btn btn-outline active" style="padding:0.4rem 0.9rem;">1</button>
                <button class="btn btn-outline" style="padding:0.4rem 0.9rem;">2</button>
                <button class="btn btn-outline" style="padding:0.4rem 0.9rem;">Next →</button>
              </div>
            `}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initCategoryPageEvents() {
  document.addEventListener('click', (e) => {
    const subcatBtn = e.target.closest('.subcat-pill-btn');
    if (subcatBtn) {
      store.setFilter('subcategory', subcatBtn.dataset.subcat);
      return;
    }

    const viewBtn = e.target.closest('.view-toggle-btn');
    if (viewBtn) {
      store.setFilter('viewMode', viewBtn.dataset.view);
      return;
    }

    if (e.target.id === 'resetCategoryFiltersBtn' || e.target.id === 'clearFiltersBtn') {
      store.resetFilters();
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.name === 'brandFilter') {
      store.setFilter('brand', e.target.value);
    }
    if (e.target.id === 'categorySortSelect') {
      store.setFilter('sortBy', e.target.value);
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'priceRangeSlider') {
      store.setFilter('priceMax', parseInt(e.target.value, 10));
    }
  });
}
