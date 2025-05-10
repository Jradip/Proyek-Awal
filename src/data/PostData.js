class PostData {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchStories(token) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data cerita. Kode: ${response.status}`);
      }

      const hasil = await response.json();
      console.info('Cerita diterima dari API:', hasil);

      if (!hasil || !Array.isArray(hasil.listStory)) {
        throw new Error('Format data tidak sesuai (bukan array)');
      }

      return hasil.listStory;
    } catch (err) {
      console.error('Terjadi kesalahan saat mengambil cerita:', err.message);
      return [];
    }
  }

  async addStory(formData, token) {
    try {
      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(hasil.message || `Gagal mengirim cerita. Status: ${response.status}`);
      }

      return hasil;
    } catch (err) {
      console.error('Gagal mengirim cerita:', err.message);
      return { error: true, message: err.message };
    }
  }
}

export default PostData;
