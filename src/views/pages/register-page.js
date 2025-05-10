import UserData from '../../data/UserData.js';

const RegisterPage = {
  async render() {
    return `
      <section id="daftarForm" class="form-section">
  <h2 class="judul-cerita">Buat Akun Baru</h2>
  <form id="formDaftar">
    <div class="form-group">
      <label for="inputNama">Nama Lengkap:</label>
      <input type="text" id="inputNama" placeholder="Nama Lengkap" required />
    </div>
    <div class="form-group">
      <label for="inputEmail">Alamat Email:</label>
      <input type="email" id="inputEmail" placeholder="Alamat Email" required />
    </div>
    <div class="form-group">
      <label for="inputSandi">Kata Sandi:</label>
      <input type="password" id="inputSandi" placeholder="Kata Sandi" required />
    </div>
    <div class="form-group">
      <button type="submit" class="btn-submit">Daftar Sekarang</button>
    </div>
    <div id="pesanDaftar" class="info-message"></div>
  </form>
</section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('formDaftar');
    const output = document.getElementById('pesanDaftar');
    const api = new UserData('https://story-api.dicoding.dev/v1');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const namaLengkap = document.getElementById('inputNama').value;
      const email = document.getElementById('inputEmail').value;
      const sandi = document.getElementById('inputSandi').value;

      if (!namaLengkap || !email || !sandi) {
        tampilkanNotifikasi('Semua kolom wajib diisi.', 'red');
        return;
      }

      try {
        await api.register(namaLengkap, email, sandi);
        tampilkanNotifikasi('✅ Registrasi berhasil. Anda akan diarahkan ke halaman login.', 'green');

        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1000);
      } catch (err) {
        tampilkanNotifikasi('❌ Gagal daftar: ' + err.message, 'red');
      }
    });

    function tampilkanNotifikasi(teks, warna) {
      output.textContent = teks;
      output.style.color = warna;
    }
  }
};

export default RegisterPage;
