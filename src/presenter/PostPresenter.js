class PostPresenter {
  constructor(model, view, token) {
    this.model = model;
    this.view = view;
    this.token = token;
  }

  async loadPost() {
     try {
      const semuaCerita = await this.model.fetchStories(this.token);

      const ceritaValid = semuaCerita.filter(item => item.lat !== null && item.lon !== null);

      console.info('Cerita yang valid (punya lokasi):', ceritaValid);

      this.view.renderStories(ceritaValid);
    } catch (err) {
      console.error('Terjadi kesalahan saat memuat cerita:', err.message);
      this.view.renderError('Data gagal dimuat. Silakan coba beberapa saat lagi.');
    }
  }
}

export default PostPresenter;
