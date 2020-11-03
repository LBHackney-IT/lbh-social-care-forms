import axios from 'axios';

export const getResidents = async (params) => {
  const { data } = await axios.get('/api/residents', {
    params,
  });
  return data;
};

export const getResident = async (id) => {
  const { data } = await axios.get(`/api/residents/${id}`);
  return data;
};

export const getResidentCases = async (id) => {
  const { data } = await axios.get(`/api/residents/${id}/cases`);
  return data;
};

export const postResidentCase = async (id, formData) => {
  const { data } = await axios.post(`/api/cases?mosaic_id=${id}`, formData);
  return data;
};
