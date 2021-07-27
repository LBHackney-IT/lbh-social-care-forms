import axios from 'axios';

import type { Case, CaseData, HistoricCaseData, User } from 'types';
import { getAuditingParams } from '../utils/auditing';

const ENDPOINT_API = process.env.ENDPOINT_API;
const AWS_KEY = process.env.AWS_KEY;

const headersWithKey = {
  'x-api-key': AWS_KEY,
};

const regex = /"_id.*ObjectId\(\S*\),./;

export const sanitiseCaseFormData = (caseFormData: string): string =>
  caseFormData && JSON.parse(caseFormData.replace(regex, ''));

export const getCases = async (
  params: Record<string, unknown>
): Promise<CaseData> => {
  const { data } = await axios.get(`${ENDPOINT_API}/cases`, {
    headers: headersWithKey,
    params: params,
  });
  return {
    ...data,
    cases: data.cases?.map((c: Record<string, string>) => ({
      ...c,
      caseFormData: sanitiseCaseFormData(c.caseFormData),
    })),
  };
};

export const getCasesByResident = (
  mosaic_id: number,
  params: Record<string, unknown>
): Promise<CaseData> => getCases({ mosaic_id, ...params });

export const getCase = async (
  case_id: string,
  params: Record<string, unknown>,
  user: User
): Promise<Case | undefined> => {
  const { data } = await axios.get(`${ENDPOINT_API}/cases/${case_id}`, {
    headers: headersWithKey,
    params: {
      ...params,
      ...getAuditingParams(user),
    },
  });
  return (
    data && { ...data, caseFormData: sanitiseCaseFormData(data.caseFormData) }
  );
};

export const getHistoricNote = async (
  case_id: string,
  params: Record<string, unknown>
): Promise<HistoricCaseData | undefined> => {
  const { data } = await axios.get(`${ENDPOINT_API}/casenotes/${case_id}`, {
    headers: headersWithKey,
    params,
  });
  return data;
};

export const getHistoricVisit = async (
  case_id: string,
  params: Record<string, unknown>
): Promise<HistoricCaseData | undefined> => {
  const { data } = await axios.get(`${ENDPOINT_API}/visits/${case_id}`, {
    headers: headersWithKey,
    params,
  });
  return data;
};

export const addCase = async (
  formData: Record<string, unknown>
): Promise<{ ref: string }> => {
  const { data } = await axios.post(`${ENDPOINT_API}/cases`, formData, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': AWS_KEY },
  });
  return data;
};
