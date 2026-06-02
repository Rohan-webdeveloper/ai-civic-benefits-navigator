import API from './api';

export const askAssistant = (message) => API.post('/ai/assistant', { message });
export const explainBenefit = (benefitName, benefitDescription) =>
  API.post('/ai/explain-benefit', { benefitName, benefitDescription });
