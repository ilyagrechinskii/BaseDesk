import { mountClientsPage } from './clients.js';
import { clientsMock } from './clients.mock.js';

const params = new URLSearchParams(location.search);
const empty = params.has('empty') || params.get('state') === 'empty' || location.hash === '#empty';
mountClientsPage(document.getElementById('clients-root'), { data: { clients: empty ? [] : clientsMock } });
