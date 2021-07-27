import axios from 'axios';
import type { RelationshipData } from 'types';
const ENDPOINT_API = process.env.ENDPOINT_API;
const AWS_KEY = process.env.AWS_KEY;
const headers = { 'x-api-key': AWS_KEY };

export const getRelationshipByResident = async (
  personId: number
): Promise<RelationshipData[] | []> => {
  const { data }: { data: RelationshipData[] } = await axios.get(
    `${ENDPOINT_API}/residents/${personId}/relationships`,
    {
      headers,
    }
  );
  return data;
};

export const addRelationship = async (
  params: Record<string, unknown>
): Promise<void> => {
  await axios.post(`${ENDPOINT_API}/relationships/personal`, params, {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
};

export const removeRelationship = async (
  relationshipId: string
): Promise<void> => {
  await axios.delete(
    `${ENDPOINT_API}/relationships/personal/${relationshipId}`,
    {
      headers,
    }
  );
};
