import API from './api';

export const getBenefits = (params) => API.get('/benefits', { params });
export const getBenefitById = (id) => API.get(`/benefits/${id}`);
export const createBenefit = (data) => API.post('/benefits', data);
