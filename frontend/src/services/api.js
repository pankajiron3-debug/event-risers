import axios from 'axios';

// Resolve API base URL with fallback to local development port 5000
const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = rawBaseURL.replace(/\/+$/, '').endsWith('/api')
  ? rawBaseURL.replace(/\/+$/, '')
  : `${rawBaseURL.replace(/\/+$/, '')}/api`;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // accommodate SMTP/PDF generation
});

// Interceptor for centralized API response handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    return Promise.reject(new Error(customMessage));
  }
);

export const clientService = {
  // Fetch clients & aggregated analytics
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await apiClient.get('/clients', { params });
    return res.data;
  },

  // Create new corporate client
  create: async (data) => {
    const res = await apiClient.post('/clients', data);
    return res.data;
  },

  // Update client
  update: async (id, data) => {
    const res = await apiClient.put(`/clients/${id}`, data);
    return res.data;
  },

  // Delete client
  delete: async (id) => {
    const res = await apiClient.delete(`/clients/${id}`);
    return res.data;
  },
};

export const billingService = {
  // Trigger automated in-memory PDF generation & email dispatch
  process: async (clientId) => {
    const res = await apiClient.post('/billing/process', { clientId });
    return res.data;
  },

  // Get inline PDF preview link directly from backend
  getPdfPreviewUrl: (clientId) => {
    return `${baseURL}/billing/view-pdf/${clientId}`;
  },
};

export const systemService = {
  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },
};

export default apiClient;
