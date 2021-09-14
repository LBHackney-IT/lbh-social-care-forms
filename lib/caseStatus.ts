import axios from 'axios';
import type { PersonCaseStatus } from 'types';
const ENDPOINT_API = process.env.ENDPOINT_API;
const AWS_KEY = process.env.AWS_KEY;
const headers = { 'x-api-key': AWS_KEY };
export const getCaseStatusByPersonId = async (
  personId: number
): Promise<PersonCaseStatus> => {
  const { data }: { data: PersonCaseStatus } = await axios.get(
    `${ENDPOINT_API}/residents/${personId}/case-statuses`,
    {
      headers,
    }
  );
  return data;
};

export const getFormValues = async (
  type: string
): Promise<PersonCaseStatus> => {
  const { data }: { data: PersonCaseStatus } = await axios.get(
    `${ENDPOINT_API}/case-statuses/form-options/${type}`,
    {
      headers,
    }
  );
  return data;
};

export const addCaseStatus = async (
  params: Record<string, unknown>
): Promise<void> => {
  await axios.post(`${ENDPOINT_API}/residents/case-statuses`, params, {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
};
