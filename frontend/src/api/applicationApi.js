import API from './api';

export const createApplication = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');
export const getAllApplications = (params) => API.get('/applications', { params });
export const updateApplicationStatus = (id, data) =>
  API.put(`/applications/${id}/status`, data);
export const uploadDocument = (formData) =>
  API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
