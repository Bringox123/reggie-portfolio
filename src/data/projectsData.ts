export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowAt: number;
}

export interface OrderRow {
  id: string;
  cashier: string;
  method: 'Cash' | 'Card' | 'Mobile Money';
  total: number;
  status: 'Settled' | 'Pending';
}

export const products: Product[] = [
  { id: 1, name: 'Basmati Rice 5kg', category: 'Grocery', price: 62.5, stock: 24, lowAt: 8 },
  { id: 2, name: 'Sunflower Oil 2L', category: 'Grocery', price: 38, stock: 5, lowAt: 8 },
  { id: 3, name: 'Fresh Milk 1L', category: 'Dairy', price: 12.75, stock: 40, lowAt: 10 },
  { id: 4, name: 'Laundry Soap Bar', category: 'Household', price: 6.5, stock: 3, lowAt: 10 },
  { id: 5, name: 'Bottled Water 1.5L', category: 'Drinks', price: 4, stock: 120, lowAt: 20 },
  { id: 6, name: 'Phone Charger USB-C', category: 'Electronics', price: 45, stock: 7, lowAt: 5 },
  { id: 7, name: 'Notebook A5', category: 'Stationery', price: 8.25, stock: 2, lowAt: 6 },
  { id: 8, name: 'Toothpaste 120g', category: 'Household', price: 14, stock: 31, lowAt: 8 },
];

export const kpis = [
  { label: 'Revenue Today', value: 'GH₵ 12,480', delta: '+8.2%' },
  { label: 'Orders', value: '186', delta: '+5.1%' },
  { label: 'Avg. Basket', value: 'GH₵ 67.10', delta: '+2.7%' },
  { label: 'Low-Stock Items', value: '3', delta: 'restock' },
];

export const revenueBars = [
  { label: 'Mon', value: 62 },
  { label: 'Tue', value: 48 },
  { label: 'Wed', value: 71 },
  { label: 'Thu', value: 55 },
  { label: 'Fri', value: 92 },
  { label: 'Sat', value: 100 },
  { label: 'Sun', value: 40 },
];

export const paymentSplit = [
  { label: 'Cash', value: 46 },
  { label: 'Mobile Money', value: 38 },
  { label: 'Card', value: 16 },
];

export const recentOrders: OrderRow[] = [
  { id: '#10482', cashier: 'Ama', method: 'Mobile Money', total: 124.5, status: 'Settled' },
  { id: '#10481', cashier: 'Kofi', method: 'Cash', total: 38, status: 'Settled' },
  { id: '#10480', cashier: 'Ama', method: 'Card', total: 215.75, status: 'Settled' },
  { id: '#10479', cashier: 'Esi', method: 'Cash', total: 18.5, status: 'Pending' },
];

export const techStack = ['Python', 'Django', 'JavaScript', 'Responsive CSS', 'SQLite / PostgreSQL', 'AWS S3', 'Jazzmin'];

export const djangoApps = [
  { name: 'pos', desc: 'Terminal, catalog and product search' },
  { name: 'cart', desc: 'Session-based cart with live totals' },
  { name: 'billing', desc: 'Cash / Card / Mobile Money checkout and receipts' },
  { name: 'restock', desc: 'Procurement and supplier restock flow' },
  { name: 'audit', desc: 'Action trail for roles and sales' },
  { name: 'sms_reminder', desc: 'SMS reminders and alerts' },
];

export const roles = ['Cashier', 'Manager', 'Admin'];

export const features = [
  'Session cart',
  'Cash / Card / Mobile-Money checkout',
  'Low-stock tray',
  'Floating mobile liquid-pill nav',
  'Restock / procurement',
  'Sales & KPI reports',
  'S3 storage fallback',
  'Query optimisation',
];

export const engineering = [
  { title: 'Role-based access', body: 'Cashier, Manager and Admin roles gate terminal, reports and administration views.' },
  { title: 'Storage fallback', body: 'Media goes to AWS S3 and automatically falls back to local storage when S3 is unavailable.' },
  { title: 'Query optimisation', body: 'select_related / prefetch_related and aggregated queries keep terminal and report pages fast.' },
  { title: 'Data layer', body: 'SQLite for local development, PostgreSQL for production, with Django migrations.' },
  { title: 'Admin UX', body: 'Jazzmin-themed Django admin for back-office management.' },
];
