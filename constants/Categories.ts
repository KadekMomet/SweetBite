/**
 * Category data with icons
 */
export const CATEGORIES = [
    { name: 'All', icon: '🛒', label: 'Semua' },
    { name: 'Cake', icon: '🎂', label: 'Kue' },
    { name: 'Cookies', icon: '🍪', label: 'Kukis' },
    { name: 'Pastry', icon: '🥐', label: 'Pastry' },
    { name: 'Bread', icon: '🍞', label: 'Roti' },
    { name: 'Dessert', icon: '🍨', label: 'Dessert' },
];

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name);
export const FILTER_CATEGORIES = CATEGORIES.filter(c => c.name !== 'All');

/**
 * Product emojis for product icon picker
 */
export const PRODUCT_EMOJIS = ['🍰', '🍪', '🥐', '🍞', '🎂', '🧁', '🍩', '🥨', '🥞', '🍫', '🍮', '🧇'];
