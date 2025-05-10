class UserData {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  async login(email, password) {
    const payload = {
      email,
      password,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${this.apiEndpoint}/login`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? 'Gagal masuk. Silakan coba kembali.');
    }

    return data;
  }

  async register(name, email, password) {
    const requestBody = {
      name,
      email,
      password,
    };

    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(`${this.apiEndpoint}/register`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message ?? 'Pendaftaran gagal. Periksa kembali data Anda.');
    }

    return result;
  }
}

export default UserData;
