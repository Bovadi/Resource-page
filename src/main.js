import { App } from './app.js';
import './styles/responsive-grid.css';

let app;

function init() {
  app = new App();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('beforeunload', () => {
  if (app) {
    app.destroy();
  }
});
