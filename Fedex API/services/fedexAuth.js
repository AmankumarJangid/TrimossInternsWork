import axios from "axios";

class FedExAuth {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.baseURL = process.env.FEDEX_BASE_URL;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${this.baseURL}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: process.env.FEDEX_API_KEY,
        client_secret: process.env.FEDEX_SECRET_KEY
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 60000); // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      throw new Error(`FedEx authentication failed: ${error.message}`);
    }
  }

  async makeAuthenticatedRequest(config) {
    const token = await this.getAccessToken();
    return axios({
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}

module.exports = new FedExAuth();