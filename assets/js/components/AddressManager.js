/* PJR Amazon/Flipkart-Style Multi-Address Management & Interactive Map Component */
import { store } from '../state.js';

let leafletMap = null;
let leafletMarker = null;

export function renderAddressCard(addr, isSelectable = false, selectedId = null) {
  const isSelected = selectedId === addr.id;

  return `
    <div class="glass-card address-card ${addr.isDefault ? 'default' : ''} ${isSelected ? 'selected' : ''}" data-address-id="${addr.id}" style="padding:1.5rem; position:relative; display:flex; flex-direction:column; gap:0.6rem; border:2px solid ${isSelected ? 'var(--pjr-teal)' : addr.isDefault ? 'var(--pjr-teal-glow)' : 'var(--pjr-light-grey)'};">
      
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:0.5rem; font-weight:800; color:var(--pjr-deep-navy); font-size:1.05rem;">
          <span style="font-size:1.3rem;">${addr.icon || '📍'}</span>
          <span>${addr.label}</span>
          ${addr.isDefault ? `<span class="badge badge-teal" style="font-size:0.7rem;">DEFAULT</span>` : ''}
        </div>

        ${isSelectable ? `
          <input type="radio" name="checkoutAddressRadio" value="${addr.id}" ${isSelected ? 'checked' : ''} style="accent-color:var(--pjr-teal); width:18px; height:18px; cursor:pointer;" />
        ` : `
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-icon edit-address-btn" data-id="${addr.id}" title="Edit Address" style="width:32px; height:32px; font-size:0.8rem;">✏️</button>
            ${!addr.isDefault ? `<button class="btn-icon delete-address-btn" data-id="${addr.id}" title="Delete Address" style="width:32px; height:32px; font-size:0.8rem; color:var(--pjr-danger);">🗑️</button>` : ''}
          </div>
        `}
      </div>

      <div style="font-weight:700; font-size:0.95rem; color:var(--pjr-dark-slate);">${addr.fullName} <span style="font-weight:400; color:var(--pjr-steel-grey); font-size:0.85rem;">(${addr.mobile})</span></div>
      
      <p style="font-size:0.88rem; color:var(--pjr-steel-grey); line-height:1.5; margin:0;">
        ${addr.fullAddress}
      </p>

      ${addr.deliveryInstructions ? `
        <div style="font-size:0.8rem; color:var(--pjr-teal); background:var(--pjr-teal-soft); padding:0.4rem 0.6rem; border-radius:var(--radius-xs); margin-top:0.25rem;">
          📝 <strong>Instructions:</strong> ${addr.deliveryInstructions}
        </div>
      ` : ''}

      <div style="font-size:0.75rem; color:var(--pjr-steel-grey); font-family:monospace; margin-top:auto; padding-top:0.4rem; border-top:1px dashed var(--pjr-light-grey);">
        📍 GPS Pin: ${addr.lat ? addr.lat.toFixed(4) : '17.4319'}° N, ${addr.lng ? addr.lng.toFixed(4) : '78.4071'}° E
      </div>

      ${!addr.isDefault && !isSelectable ? `
        <button class="btn btn-outline set-default-address-btn" data-id="${addr.id}" style="padding:0.3rem 0.75rem; font-size:0.75rem; margin-top:0.4rem; align-self:flex-start;">
          Set As Default
        </button>
      ` : ''}
    </div>
  `;
}

export function renderAddressModal() {
  const isOpen = store.activeModal === 'editAddress';
  if (!isOpen) return `<div class="modal-overlay" id="addressModal"></div>`;

  const addr = store.addressToEdit || {
    id: null,
    label: 'Home',
    fullName: store.user.name,
    mobile: '+91 98765 43210',
    houseBuilding: '',
    street: '',
    landmark: '',
    area: 'Jubilee Hills',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    country: 'India',
    fullAddress: '',
    deliveryInstructions: '',
    lat: 17.4319,
    lng: 78.4071,
    isDefault: store.addresses.length === 0
  };

  const labels = ['Home', 'Work', 'Office', 'Parents', 'Other'];

  return `
    <div class="modal-overlay active" id="addressModal">
      <div class="modal-content" style="max-width:850px; padding:2rem; overflow-y:auto; max-height:92vh;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--pjr-light-grey);">
          <div>
            <span class="brand-tagline">GOOGLE MAPS PIN INTEGRATED</span>
            <h3 style="margin:0; font-size:1.4rem;">${addr.id ? 'Edit Saved Address' : 'Add New Delivery Address'}</h3>
          </div>
          <button class="close-btn" id="closeAddressModal">✕</button>
        </div>

        <form id="addressForm">
          <!-- Address Label Selection -->
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label class="form-label">Save Address As</label>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${labels.map(l => `
                <button type="button" class="btn btn-outline address-label-btn ${(addr.label || 'Home') === l ? 'active' : ''}" data-label="${l}" style="padding:0.4rem 0.9rem; font-size:0.85rem;">
                  ${store.getIconForLabel(l)} ${l}
                </button>
              `).join('')}
            </div>
            <input type="hidden" id="addrLabelInput" value="${addr.label || 'Home'}" />
          </div>

          <!-- Interactive Google Maps Container -->
          <div style="margin-bottom:1.5rem; border:1px solid var(--pjr-light-grey); border-radius:var(--radius-md); overflow:hidden; background:var(--pjr-bg-grey);">
            <div style="padding:0.85rem 1rem; background:var(--pjr-deep-navy); color:var(--pjr-pure-white); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.85rem; font-weight:700; color:var(--pjr-teal-light);">📍 DRAG MAP PIN TO EXACT HOUSE ENTRANCE</span>
              
              <button type="button" class="btn btn-teal" id="useCurrentGpsBtn" style="padding:0.3rem 0.75rem; font-size:0.75rem;">
                🎯 Use Current GPS Location
              </button>
            </div>

            <!-- Place Search Bar -->
            <div style="padding:0.5rem 1rem; background:var(--pjr-pure-white); border-bottom:1px solid var(--pjr-light-grey); display:flex; gap:0.5rem;">
              <input type="text" class="form-input" id="mapSearchInput" placeholder="Search locality or landmark (e.g. Jubilee Hills, Hyderabad)..." style="padding:0.4rem 0.8rem; font-size:0.85rem; flex:1;" />
              <button type="button" class="btn btn-outline" id="mapSearchBtn" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Search</button>
            </div>

            <div id="interactiveMap" style="height:240px; width:100%; z-index:10;"></div>

            <div style="padding:0.5rem 1rem; background:rgba(0,108,110,0.08); font-size:0.8rem; color:var(--pjr-deep-navy); font-weight:600; display:flex; justify-content:space-between;">
              <span id="mapPinCoordsText">Lat: ${addr.lat.toFixed(4)}, Lng: ${addr.lng.toFixed(4)}</span>
              <span>Zoom level active</span>
            </div>
          </div>

          <!-- Address Input Fields Grid -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="addrFullName" value="${addr.fullName}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input type="text" class="form-input" id="addrMobile" value="${addr.mobile}" required />
            </div>

            <div class="form-group">
              <label class="form-label">House / Flat / Building Name *</label>
              <input type="text" class="form-input" id="addrHouse" value="${addr.houseBuilding}" placeholder="Flat 402, Royal Residency" required />
            </div>

            <div class="form-group">
              <label class="form-label">Street / Road Name *</label>
              <input type="text" class="form-input" id="addrStreet" value="${addr.street}" placeholder="Road No. 36" required />
            </div>

            <div class="form-group">
              <label class="form-label">Landmark (Optional)</label>
              <input type="text" class="form-input" id="addrLandmark" value="${addr.landmark}" placeholder="Near Apollo Hospital" />
            </div>

            <div class="form-group">
              <label class="form-label">Area / Locality *</label>
              <input type="text" class="form-input" id="addrArea" value="${addr.area}" required />
            </div>

            <div class="form-group">
              <label class="form-label">City / Town *</label>
              <input type="text" class="form-input" id="addrCity" value="${addr.city}" required />
            </div>

            <div class="form-group">
              <label class="form-label">State & Pincode *</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" class="form-input" id="addrState" value="${addr.state}" placeholder="State" required />
                <input type="text" class="form-input" id="addrPincode" value="${addr.pincode}" placeholder="500033" style="width:110px;" required />
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top:0.5rem;">
            <label class="form-label">Delivery Instructions (Optional)</label>
            <input type="text" class="form-input" id="addrInstructions" value="${addr.deliveryInstructions || ''}" placeholder="e.g. Leave with guard / Do not ring bell after 9 PM" />
          </div>

          <div class="form-group" style="display:flex; align-items:center; gap:0.5rem;">
            <input type="checkbox" id="addrIsDefault" ${addr.isDefault ? 'checked' : ''} style="accent-color:var(--pjr-teal); width:18px; height:18px; cursor:pointer;" />
            <label for="addrIsDefault" style="font-size:0.9rem; cursor:pointer; font-weight:600; color:var(--pjr-dark-slate);">Set as Default Delivery Address</label>
          </div>

          <div style="display:flex; gap:1rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--pjr-light-grey);">
            <button type="button" class="btn btn-outline" id="cancelAddressModal">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Save Address & Pin Location 📍</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initMapPickerInstance() {
  const mapEl = document.getElementById('interactiveMap');
  if (!mapEl || typeof L === 'undefined') return;

  const addr = store.addressToEdit || { lat: 17.4319, lng: 78.4071 };
  const initialLat = addr.lat || 17.4319;
  const initialLng = addr.lng || 78.4071;

  leafletMap = L.map('interactiveMap').setView([initialLat, initialLng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap & PJR Maps'
  }).addTo(leafletMap);

  leafletMarker = L.marker([initialLat, initialLng], { draggable: true }).addTo(leafletMap);

  leafletMarker.on('dragend', function (event) {
    const position = leafletMarker.getLatLng();
    updateCoordsAndReverseGeocode(position.lat, position.lng);
  });

  leafletMap.on('click', function (e) {
    leafletMarker.setLatLng(e.latlng);
    updateCoordsAndReverseGeocode(e.latlng.lat, e.latlng.lng);
  });
}

function updateCoordsAndReverseGeocode(lat, lng) {
  const coordsText = document.getElementById('mapPinCoordsText');
  if (coordsText) coordsText.textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

  // Auto-fill address fields via OpenStreetMap Nominatim API
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.address) {
        const a = data.address;
        const street = a.road || a.pedestrian || a.suburb || '';
        const area = a.suburb || a.neighbourhood || a.residential || '';
        const city = a.city || a.town || a.county || 'Hyderabad';
        const state = a.state || 'Telangana';
        const pincode = a.postcode || '500033';

        if (street && document.getElementById('addrStreet')) document.getElementById('addrStreet').value = street;
        if (area && document.getElementById('addrArea')) document.getElementById('addrArea').value = area;
        if (city && document.getElementById('addrCity')) document.getElementById('addrCity').value = city;
        if (state && document.getElementById('addrState')) document.getElementById('addrState').value = state;
        if (pincode && document.getElementById('addrPincode')) document.getElementById('addrPincode').value = pincode;
      }
    }).catch(() => {});
}

export function initAddressEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeAddressModal' || e.target.id === 'cancelAddressModal' || e.target.id === 'addressModal') {
      store.closeModal();
      return;
    }

    const labelBtn = e.target.closest('.address-label-btn');
    if (labelBtn) {
      document.querySelectorAll('.address-label-btn').forEach(b => b.classList.remove('active'));
      labelBtn.classList.add('active');
      const hiddenInput = document.getElementById('addrLabelInput');
      if (hiddenInput) hiddenInput.value = labelBtn.dataset.label;
      return;
    }

    const editBtn = e.target.closest('.edit-address-btn');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const addr = store.addresses.find(a => a.id === id);
      if (addr) store.openModal('editAddress', addr);
      return;
    }

    const delBtn = e.target.closest('.delete-address-btn');
    if (delBtn) {
      const id = delBtn.dataset.id;
      if (confirm('Are you sure you want to delete this delivery address?')) {
        store.deleteAddress(id);
      }
      return;
    }

    const defBtn = e.target.closest('.set-default-address-btn');
    if (defBtn) {
      const id = defBtn.dataset.id;
      store.setDefaultAddress(id);
      return;
    }

    if (e.target.id === 'useCurrentGpsBtn') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          if (leafletMap && leafletMarker) {
            leafletMap.setView([latitude, longitude], 16);
            leafletMarker.setLatLng([latitude, longitude]);
            updateCoordsAndReverseGeocode(latitude, longitude);
          }
        }, () => alert('Unable to fetch location. Please allow GPS permissions.'));
      }
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'addressForm') {
      e.preventDefault();
      const pos = leafletMarker ? leafletMarker.getLatLng() : { lat: 17.4319, lng: 78.4071 };
      const label = document.getElementById('addrLabelInput')?.value || 'Home';
      const fullName = document.getElementById('addrFullName')?.value || '';
      const mobile = document.getElementById('addrMobile')?.value || '';
      const houseBuilding = document.getElementById('addrHouse')?.value || '';
      const street = document.getElementById('addrStreet')?.value || '';
      const landmark = document.getElementById('addrLandmark')?.value || '';
      const area = document.getElementById('addrArea')?.value || '';
      const city = document.getElementById('addrCity')?.value || '';
      const state = document.getElementById('addrState')?.value || '';
      const pincode = document.getElementById('addrPincode')?.value || '';
      const deliveryInstructions = document.getElementById('addrInstructions')?.value || '';
      const isDefault = document.getElementById('addrIsDefault')?.checked || false;

      const fullAddress = `${houseBuilding}, ${street}${landmark ? ', Near ' + landmark : ''}, ${area}, ${city}, ${state} - ${pincode}`;

      const addrData = {
        label,
        fullName,
        mobile,
        houseBuilding,
        street,
        landmark,
        area,
        city,
        district: city,
        state,
        pincode,
        country: 'India',
        fullAddress,
        deliveryInstructions,
        lat: pos.lat,
        lng: pos.lng,
        isDefault
      };

      if (store.addressToEdit && store.addressToEdit.id) {
        store.updateAddress(store.addressToEdit.id, addrData);
      } else {
        store.addAddress(addrData);
      }

      store.closeModal();
    }
  });
}
