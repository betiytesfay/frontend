import axios from 'axios';

let accessToken = localStorage.getItem('accessToken'); // or wherever you store it
let refreshToken = localStorage.getItem('refreshToken');

const axiosInstance = axios.create({
  baseURL: 'https://your-backend.com/api', // replace with your backend
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

// Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) { // unauthorized
      try {
        const res = await axios.post('https://your-backend.com/api/refresh', {
          token: refreshToken,
        });
        accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        error.config.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(error.config);
      } catch (err) {
        console.error('Refresh token failed', err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
