const API_BASE_URL = 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export const workspaceApi = {
  getById: (id) => apiFetch(`/workspaces/${id}`),
  create: (data) => apiFetch('/workspaces', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getByProject: (projectId) => apiFetch(`/workspaces/project/${projectId}`),
  getMembers: (id) => apiFetch(`/workspaces/${id}/members`),
  inviteUser: (id, email) => apiFetch(`/workspaces/${id}/invite`, {
    method: 'POST',
    body: JSON.stringify({ inviteeEmail: email }),
  }),
  delete: (id) => apiFetch(`/workspaces/${id}`, {
    method: 'DELETE',
  }),
  update: (id, updates) => apiFetch(`/workspaces/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  removeMember: (workspaceId, userId) => apiFetch(`/workspaces/${workspaceId}/members/${userId}`, {
    method: 'DELETE',
  }),
};

export const taskApi = {
  getByWorkspace: (workspaceId) => apiFetch(`/tasks/workspace/${workspaceId}`),
  create: (taskData) => apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
};

export const activityApi = {
  getByWorkspace: (workspaceId) => apiFetch(`/activity/workspace/${workspaceId}`),
};
