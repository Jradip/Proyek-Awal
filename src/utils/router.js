import HomePage from '../views/pages/home-page.js';
import AddStory from '../views/pages/add-page.js';
import LoginPage from '../views/pages/login-page.js';
import RegisterPage from '../views/pages/register-page.js';

const routes = {
  '/': HomePage,
  '/add-story': AddStory,
  '/login': LoginPage,
  '/register': RegisterPage,
};

const Router = {
  mulai() {
    this.muatanHalaman = this.muatanHalaman.bind(this);
    window.addEventListener('hashchange', this.muatanHalaman);

    const tombolKeluar = document.getElementById('nav-logout');
    if (tombolKeluar) {
      tombolKeluar.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.hash = '/login';
        this.perbaruiNavigasi();
      });
    }

    this.muatanHalaman();
    this.perbaruiNavigasi();
  },

  async muatanHalaman() {
    const path = window.location.hash.slice(1) || '/';
    const token = localStorage.getItem('token');

    if (token && (path === '/login' || path === '/register')) {
      window.location.hash = '/';
      return;
    }

    if (!token && path !== '/login' && path !== '/register') {
      window.location.hash = '/login';
      return;
    }

    const halaman = routes[path];
    if (halaman) {
      const kontainerUtama = document.getElementById('main-content');

      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          kontainerUtama.innerHTML = await halaman.render();
          await halaman.afterRender();
          this.perbaruiNavigasi();
        });
      } else {
        kontainerUtama.innerHTML = await halaman.render();
        await halaman.afterRender();
        this.perbaruiNavigasi();
      }
    }
  },

  perbaruiNavigasi() {
    const token = localStorage.getItem('token');

    const linkHome = document.getElementById('nav-home');
    const linkLogin = document.getElementById('nav-login');
    const linkTambah = document.getElementById('nav-add');
    const linkDaftar = document.getElementById('nav-register');
    const linkKeluar = document.getElementById('nav-logout');

    if (linkLogin) linkLogin.style.display = token ? 'none' : 'inline-block';
    if (linkDaftar) linkDaftar.style.display = token ? 'none' : 'inline-block';
    if (linkTambah) linkTambah.style.display = token ? 'inline-block' : 'none';
    if (linkHome) linkHome.style.display = token ? 'inline-block' : 'none';
    if (linkKeluar) linkKeluar.style.display = token ? 'inline-block' : 'none';
  },
};

export default Router;
