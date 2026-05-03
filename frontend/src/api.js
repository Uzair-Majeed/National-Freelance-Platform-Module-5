const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const activeUserId = localStorage.getItem('activeUserId') || '1';

  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': activeUserId,
    ...options.headers,
  };

  // If Content-Type is explicitly set to undefined, delete it so the browser sets it (for FormData)
  if (headers['Content-Type'] === undefined) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// ── Workspace API ──────────────────────────────────────────────────────────────
export const workspaceApi = {
  getById: (id) => apiFetch(`/workspaces/${id}`),
  create: (data) => apiFetch('/workspaces', { method: 'POST', body: JSON.stringify(data) }),
  getByProject: (projectId) => apiFetch(`/workspaces/project/${projectId}`),
  getMembers: (id) => apiFetch(`/workspaces/${id}/members`),
  inviteUser: (id, email) =>
    apiFetch(`/workspaces/${id}/invite`, { method: 'POST', body: JSON.stringify({ inviteeEmail: email }) }),
  delete: (id) => apiFetch(`/workspaces/${id}`, { method: 'DELETE' }),
  update: (id, updates) => apiFetch(`/workspaces/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  removeMember: (workspaceId, userId) =>
    apiFetch(`/workspaces/${workspaceId}/members/${userId}`, { method: 'DELETE' }),
  getInvitationById: (invitationId) => apiFetch(`/workspaces/invitation/${invitationId}`),
  getInvitations: (workspaceId) => apiFetch(`/workspaces/${workspaceId}/invitations`),
  getMyInvitations: () => apiFetch('/workspaces/invitations/my'),
  respondToInvitation: (invitationId, status) =>
    apiFetch(`/workspaces/invitation/${invitationId}/respond`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  simulateSession: (email) => apiFetch('/auth/session', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

// ── Task API ───────────────────────────────────────────────────────────────────
export const taskApi = {
  getByWorkspace: (workspaceId) => apiFetch(`/tasks/workspace/${workspaceId}`),
  getById: (taskId) => apiFetch(`/tasks/${taskId}`),
  create: (taskData) => apiFetch('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  update: (taskId, updates) => apiFetch(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updates) }),
  updateStatus: (taskId, status) =>
    apiFetch(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (taskId) => apiFetch(`/tasks/${taskId}`, { method: 'DELETE' }),
};

// ── File API ──────────────────────────────────────────────────────────────────
export const fileApi = {
  upload: (formData) => apiFetch('/files/upload', {
    method: 'POST',
    body: formData, // fetch will handle boundary for FormData
    headers: {
      // Don't set Content-Type, browser will do it for FormData
      'Content-Type': undefined
    }
  }),
  getByWorkspace: (workspaceId) => apiFetch(`/files/workspace/${workspaceId}`),
  getByTask: (taskId) => apiFetch(`/files/task/${taskId}`),
  getDownloadUrl: (fileId) => `${API_BASE_URL}/files/${fileId}/download`,
  getMediaUrl: (mediaId) => `${API_BASE_URL}/files/media/${mediaId}`,
};

// ── Activity API ───────────────────────────────────────────────────────────────
export const activityApi = {
  getByWorkspace: (workspaceId) => apiFetch(`/activity/workspace/${workspaceId}`),
  getByEntity: (type, id) => apiFetch(`/activity/entity/${type}/${id}`),
};

// ── Role API ───────────────────────────────────────────────────────────────────
export const roleApi = {
  getByWorkspace: (workspaceId) => apiFetch(`/roles/workspace/${workspaceId}`),
  assignRole: (workspaceId, targetUserId, roleId) =>
    apiFetch(`/roles/workspace/${workspaceId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ targetUserId, roleId }),
    }),
  checkPermission: (workspaceId, action) =>
    apiFetch(`/roles/workspace/${workspaceId}/check?action=${action}`),
};

// ── Chat API ───────────────────────────────────────────────────────────────────
export const chatApi = {
  getRoom: (workspaceId) => apiFetch(`/chat/workspace/${workspaceId}/room`),
  getHistory: (workspaceId, limit = 50, offset = 0) => 
    apiFetch(`/chat/workspace/${workspaceId}?limit=${limit}&offset=${offset}`),
  sendMessage: (workspaceId, content, mediaId = null, replyToMsgId = null) => 
    apiFetch(`/chat/workspace/${workspaceId}`, {
      method: 'POST',
      body: JSON.stringify({ content, mediaId, replyToMsgId }),
    }),
  editMessage: (messageId, content) => 
    apiFetch(`/chat/message/${messageId}`, { 
      method: 'PUT',
      body: JSON.stringify({ content })
    }),
  deleteMessage: (messageId) => apiFetch(`/chat/message/${messageId}`, { method: 'DELETE' }),
};
