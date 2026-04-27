import { API_BASE_URL } from './constants';

/**
 * API client for communicating with the backend.
 * Falls back gracefully if backend is unavailable.
 */
async function request(endpoint, options = {}) {
  // Validate endpoint is a relative path (prevent open redirect / SSRF)
  if (typeof endpoint !== 'string' || !endpoint.startsWith('/')) {
    throw new Error('Invalid API endpoint.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new Error('Unable to reach the server. Please check your connection.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // Only use server message if it's a short, safe string
    const serverMsg = typeof error.message === 'string' && error.message.length < 200
      ? error.message
      : `Request failed (${response.status})`;
    throw new Error(serverMsg);
  }

  return response.json();
}

export const api = {
  // Projects
  getProjects: () => request('/projects'),
  getProject: (id) => {
    // Validate id is alphanumeric to prevent path traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return Promise.reject(new Error('Invalid project ID.'));
    }
    return request(`/projects/${encodeURIComponent(id)}`);
  },

  // Experience
  getExperience: () => request('/experience'),

  // Skills
  getSkills: () => request('/skills'),

  // Contact
  sendMessage: (data) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
