import API from './api';

export const checkEligibility = (data) => API.post('/eligibility/check', data);
