import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const createCandidate = (candidateData) => api.post('/candidates', candidateData);
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const updateCandidate = (id, candidateData) => api.put(`/candidates/${id}`, candidateData);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// Social Media Profile
export const createSocialMediaProfile = (data) => api.post('/social_media_profiles', data);
export const getSocialMediaProfiles = (candidateId) => api.get(`/social_media_profiles?candidate_id=${candidateId}`);

// Political Mandate
export const createPoliticalMandate = (data) => api.post('/political_mandates', data);
export const getPoliticalMandates = (candidateId) => api.get(`/political_mandates?candidate_id=${candidateId}`);

// Parliamentary Amendment
export const createParliamentaryAmendment = (data) => api.post('/parliamentary_amendments', data);
export const getParliamentaryAmendments = (candidateId) => api.get(`/parliamentary_amendments?candidate_id=${candidateId}`);

// Thematic Position
export const createThematicPosition = (data) => api.post('/thematic_positions', data);
export const getThematicPositions = (candidateId) => api.get(`/thematic_positions?candidate_id=${candidateId}`);

// Election History
export const createElectionHistory = (data) => api.post('/election_history', data);
export const getElectionHistory = (candidateId) => api.get(`/election_history?candidate_id=${candidateId}`);

// Research Cross Section
export const createResearchCrossSection = (data) => api.post('/research_cross_sections', data);
export const getResearchCrossSections = (researchDataId) => api.get(`/research_cross_sections?research_data_id=${researchDataId}`);

// Municipal Support
export const createMunicipalSupport = (data) => api.post('/municipal_support', data);
export const getMunicipalSupport = (candidateId) => api.get(`/municipal_support?candidate_id=${candidateId}`);

// External Competitor
export const createExternalCompetitor = (data) => api.post('/external_competitors', data);
export const getExternalCompetitors = (candidateId) => api.get(`/external_competitors?candidate_id=${candidateId}`);

// Internal Competitor
export const createInternalCompetitor = (data) => api.post('/internal_competitors', data);
export const getInternalCompetitors = (candidateId) => api.get(`/internal_competitors?candidate_id=${candidateId}`);

// Media Monitoring
export const createMediaMonitoring = (data) => api.post('/media_monitoring', data);
export const getMediaMonitoring = (candidateId) => api.get(`/media_monitoring?candidate_id=${candidateId}`);

// Vulnerability Dossier
export const createVulnerabilityDossier = (data) => api.post('/vulnerability_dossiers', data);
export const getVulnerabilityDossiers = (candidateId) => api.get(`/vulnerability_dossiers?candidate_id=${candidateId}`);

export default api;


