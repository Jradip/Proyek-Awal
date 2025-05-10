import PostData from '../../data/PostData.js';
import { initMap, getSelectedLocation } from '../../utils/location.js';


const AddStory = {
  async render() {
    return `
      <section class="halamanTambahCerita page-enter">
        <h2 class="judul-cerita">Tambah Cerita Baru</h2>
        <form id="formCerita">
          <label for="description">Deskripsi:</label>
          <textarea id="description" required></textarea>

         <label for="kameraLive">Ambil Gambar:</label>
        <video id="kameraLive" autoplay style="display: none;"></video>

          <canvas id="kanvas" style="display: none;"></canvas>
          <img id="pratinjauFoto" alt="Preview Foto" style="display: none; max-width: 100%;">

          <button type="button" id="mulaiKamera">Buka Kamera</button>
          <button type="button" id="ambilFoto" style="display: none;">Ambil Foto</button>
          <button type="button" id="matikanKamera" style="display: none;">Matikan Kamera</button>

          <label for="image">Atau Pilih Gambar:</label>
          <input id="image" type="file" accept="image/*">

          <div id="map" style="height: 300px;"></div>
          <label for="latInput">Latitude:</label>
          <input id="latInput" type="text" readonly>

          <label for="lngInput">Longitude:</label>
          <input id="lngInput" type="text" readonly>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    initMap();

    const section = document.querySelector('.halamanTambahCerita');
    if (section) {
      requestAnimationFrame(() => section.classList.add('page-enter-active'));
      setTimeout(() => section.classList.remove('page-enter', 'page-enter-active'), 600);
    }

    const video = document.getElementById('kameraLive');
    const canvas = document.getElementById('kanvas');
    const preview = document.getElementById('pratinjauFoto');
    const btnStart = document.getElementById('mulaiKamera');
    const btnCapture = document.getElementById('ambilFoto');
    const btnStop = document.getElementById('matikanKamera');
    const fileInput = document.getElementById('image');

    let streamKamera = null;
    let gambarTertangkap = null;

    async function mulaiKamera() {
      try {
        streamKamera = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = streamKamera;

        await new Promise(resolve => {
          video.onloadedmetadata = () => resolve();
        });

        video.play();
        video.style.display = 'block';
        btnCapture.style.display = 'block';
        btnStop.style.display = 'block';
        btnStart.style.display = 'none';
        fileInput.style.display = 'none';
      } catch (err) {
        alert('Tidak bisa mengakses kamera. Coba browser lain atau periksa izin.');
        console.error('Kamera error:', err);
      }
    }

    function ambilFoto() {
      if (!video.videoWidth || !video.videoHeight) {
        alert('Kamera belum siap.');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (!blob) {
          alert('Gagal mengambil foto.');
          return;
        }

        gambarTertangkap = blob;
        preview.src = URL.createObjectURL(blob);
        preview.style.display = 'block';
        preview.classList.add('show');
      }, 'image/png');

      matikanKamera();
    }

    function matikanKamera() {
      if (streamKamera) {
        streamKamera.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        video.style.display = 'none';
        btnCapture.style.display = 'none';
        btnStop.style.display = 'none';
        btnStart.style.display = 'block';
        fileInput.style.display = 'block';
      }
    }

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        gambarTertangkap = file;
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      }
    });

    document.getElementById('formCerita').addEventListener('submit', async (e) => {
      e.preventDefault();

      const lokasi = getSelectedLocation();
      if (!lokasi || !lokasi.lat || !lokasi.lng) {
        alert('Pilih lokasi di peta dulu.');
        return;
      }

      if (!gambarTertangkap) {
        alert('Pilih atau ambil gambar terlebih dahulu.');
        return;
      }

      const data = new FormData();
      data.append('description', document.getElementById('description').value);
      data.append('photo', gambarTertangkap, 'foto.png');
      data.append('lat', lokasi.lat);
      data.append('lon', lokasi.lng);

      try {
        const token = localStorage.getItem("token");
        const model = new PostData('https://story-api.dicoding.dev/v1');
        await model.addStory(data, token);

        alert('Cerita berhasil dikirim!');
        window.location.hash = '#/';
      } catch (err) {
        alert('Terjadi kesalahan saat mengirim.');
        console.error('Kirim error:', err);
      }
    });

    btnStart.addEventListener('click', mulaiKamera);
    btnCapture.addEventListener('click', ambilFoto);
    btnStop.addEventListener('click', matikanKamera);
  }
};

export default AddStory;