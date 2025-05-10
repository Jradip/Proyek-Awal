import PostData from '../../data/PostData.js';
import PostView from '../PostView.js';
import PostPresenter from '../../presenter/PostPresenter.js';

const HomePage = {
  async render() {
    return `
      <section id="home" class="page-enter">
  <h2 class="judul-cerita">Jelajahi Cerita</h2>
  <div id="map"></div>
  <div id="listPostingan"></div>
  </section>
    `;
  },

  async afterRender() {
    const aksesToken = localStorage.getItem("token");

    const elemenHalaman = document.getElementById('home');
    if (elemenHalaman) {
      requestAnimationFrame(() => {
        elemenHalaman.classList.add('page-enter-active');
      });

      setTimeout(() => {
        elemenHalaman.classList.remove('page-enter', 'page-enter-active');
      }, 600);
    }

    const kontainerCerita = document.getElementById('listPostingan');
    if (!kontainerCerita) {
      console.warn('⚠️ Elemen dengan ID #listPostingan tidak ditemukan.');
      return;
    }

    const sumberData = new PostData('https://story-api.dicoding.dev/v1');
    const tampilan = new PostView(kontainerCerita, 'map');
    const pengendali = new PostPresenter(sumberData, tampilan, aksesToken);

    try {
      await pengendali.loadPost();
    } catch (err) {
      console.error('❌ Gagal memuat postingan:', err.message);
    }
  }
};

export default HomePage;
