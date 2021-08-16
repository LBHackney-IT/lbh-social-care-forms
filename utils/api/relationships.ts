import useSWR, { SWRResponse } from 'swr';
import axios from 'axios';
import type { RelationshipData, ErrorAPI } from 'types';

export const useRelationships = (
  id: number
): SWRResponse<RelationshipData, ErrorAPI> =>
  useSWR(`/api/residents/${id}/relationships`);

interface addRelationshipFormData {
  personId: number;
  otherPersonId: number;
  createdBy: string;
  type: string;
  additionalOptions?: string | string[] | boolean;
  isMainCarer?: string;
  details?: string;
}

export const addRelationships = async (
  formData: addRelationshipFormData
): Promise<Record<string, unknown>> => {
  if (formData.additionalOptions) {
    if (
      Array.isArray(formData.additionalOptions) &&
      formData.type === 'parent' &&
      formData.additionalOptions?.includes('isParentOfUnbornChild')
    ) {
      formData.type = 'parentOfUnbornChild';
    }

    if (
      Array.isArray(formData.additionalOptions) &&
      formData.type === 'sibling' &&
      formData.additionalOptions?.includes('isSiblingOfUnbornChild')
    ) {
      formData.type = 'siblingOfUnbornChild';
    }

    if (
      (Array.isArray(formData.additionalOptions) &&
        formData.additionalOptions?.includes('isMainCarer')) ||
      formData.additionalOptions == 'isMainCarer'
    ) {
      formData.isMainCarer = 'Y';
    }

    delete formData.additionalOptions;
  }

  const response = await axios.post(`/api/relationships`, formData);

  return response?.data;
};

export const removeRelationship = async (
  relationshipId: string
): Promise<Record<string, unknown>> => {
  const response = await axios.delete(`/api/relationships/${relationshipId}`);

  return response?.data;
};
