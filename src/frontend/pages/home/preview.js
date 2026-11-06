import { mountHomePage } from './page.js';

const root = document.getElementById('app');
if (root) {
    mountHomePage(root, { data: {} });
}