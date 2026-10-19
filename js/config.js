/* ============================================================
 * config.js — static configuration that is NOT stored in the database.
 * ============================================================ */

const CFG = {
  supabase: {
    url: 'https://tiosonrfllgducejhvqc.supabase.co',
    anonKey: 'sb_publishable_y6_l21iYHeQxDHxHPEXzyA_YK7L--Qb'
  },
  shop: {
    currency: '₱',
    adminPassword: 'CHANGE_ME_LOCALLY',  // prototype-only gate; replace with Supabase Auth later
    defaultDeliveryFee: 100,
    defaultFreeDeliveryOver: 1500,
    photoBucket: 'rice-photos'           // Supabase Storage bucket for uploaded rice photos
  },

  varieties: ['Jasmine','Basmati','Sinandomeng','Dinorado','Brown','Glutinous','Black Rice','Red Rice'],
  grades:    ['Premium','Grade A','Grade B'],
  statuses:  ['Pending','Confirmed','Out for delivery','Delivered','Cancelled'],

  orderStatusColor: {
    'Pending':'amber',
    'Confirmed':'blue',
    'Out for delivery':'blue',
    'Delivered':'green',
    'Cancelled':'red'
  },

  /* Product form is generated from this list. Add a field → form updates. */
  productFields: [
    { name:'name',         label:'Rice name',              type:'text',     required:true, wide:true, placeholder:'e.g. Jasmine Rice' },
    { name:'variety',      label:'Variety',                type:'select',   options:'varieties', required:true },
    { name:'grade',        label:'Grade',                  type:'select',   options:'grades' },
    { name:'price_per_kg', label:'Selling price / kg',     type:'currency', required:true, placeholder:'0.00' },
    { name:'cost_per_kg',  label:'Cost / kg',              type:'currency', placeholder:'0.00' },
    { name:'stock_kg',     label:'Stock on hand (kg)',     type:'number',   required:true, placeholder:'0' },
    { name:'reorder_kg',   label:'Low-stock alert at (kg)',type:'number',   placeholder:'100' },
    { name:'origin',       label:'Origin / farm',          type:'text',     placeholder:'e.g. Nueva Ecija' },
    { name:'image_url',    label:'Photo',                  type:'image',    wide:true },
    { name:'posted',       label:'Post this rice in the shop', type:'toggle', wide:true },
    { name:'description',  label:'Description',            type:'textarea', wide:true, placeholder:'What customers will read on the shop page…' }
  ]
};
