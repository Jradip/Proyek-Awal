import UserData from '../../data/UserData.js';

const LoginPage = {
  async render() {
    return `
      <section id="formLogin" class="form-section">
  <h2 class="judul-cerita">Masuk ke Akun Anda</h2>
  <form id="formMasuk">
    <div class="form-group">
      <label for="inputEmail">Alamat Email:</label>
      <input type="email" id="inputEmail" placeholder="Alamat Email" required />
    </div>
    <div class="form-group">
      <label for="inputPassword">Kata Sandi:</label>
      <input type="password" id="inputPassword" placeholder="Kata Sandi" required />
    </div>
    <div class="form-group">
      <button type="submit" class="btn-login">Masuk</button>
    </div>
    <div id="pesanLogin" class="info-message"></div>
  </form>
</section>

    `;
  },

  async afterRender() {
    const form = document.getElementById('formMasuk');
    const pesan = document.getElementById('pesanLogin');
    const endpoint = 'https://story-api.dicoding.dev/v1';
    const pengguna = new UserData(endpoint);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailValue = document.getElementById('inputEmail').value;
      const passwordValue = document.getElementById('inputPassword').value;

      if (!emailValue || !passwordValue) {
        tampilkanPesan('Email dan kata sandi wajib diisi.', 'red');
        return;
      }

      try {
        const hasilLogin = await pengguna.login(emailValue, passwordValue);
        const { token, userId, name } = hasilLogin.loginResult;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);

        tampilkanPesan('Berhasil masuk. Mengalihkan...', 'green');
        setTimeout(() => {
          window.location.hash = '/';
        }, 800);
      } catch (err) {
        tampilkanPesan('Login gagal: ' + err.message, 'red');
      }
    });

    function tampilkanPesan(teks, warna) {
      pesan.textContent = teks;
      pesan.style.color = warna;
    }
  }
};

export default LoginPage;
