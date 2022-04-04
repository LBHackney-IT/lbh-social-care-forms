import useSWR, { SWRResponse } from 'swr';
import axios from 'axios';

import type {
  AgeContext,
  Allocation,
  AllocationData,
  ErrorAPI,
  TeamData,
  Worker,
  WorkerAllocation,
} from 'types';

import { getQueryString } from 'utils/urls';

export const useAllocatedWorkers = (
  id: number
): SWRResponse<AllocationData, ErrorAPI> =>
  useSWR(`/api/residents/${id}/allocations`);

export const useResidentAllocation = (
  id: number,
  allocationId: number
): SWRResponse<Allocation, ErrorAPI> =>
  useSWR(`/api/residents/${id}/allocations/${allocationId}`);

export const useTeams = ({
  ageContext,
}: {
  ageContext: AgeContext;
}): SWRResponse<TeamData, ErrorAPI> =>
  useSWR(`/api/teams${ageContext ? '?ageContext=' + ageContext : ''}`);

export const useTeamWorkers = (
  teamId?: number
): SWRResponse<Worker[], ErrorAPI> =>
  useSWR(teamId ? `/api/teams/${teamId}/workers` : null);

export const useAllocationsByWorker = (
  workerId: number
): SWRResponse<WorkerAllocation, ErrorAPI> =>
  useSWR(`/api/workers/${workerId}/allocations`);

export const useAllocationsByTeam = (
  teamId: number,
  parameters: Record<string, unknown>
): SWRResponse<WorkerAllocation, ErrorAPI> => {
  return useSWR(
    `/api/teams/${teamId}/allocations?${getQueryString(parameters)}`
  );
};

export const deleteAllocation = async (
  residentId: number,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data } = await axios.patch(
    `/api/residents/${residentId}/allocations`,
    body
  );
  return data;
};

export const addAllocatedWorker = async (
  residentId: number,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data } = await axios.post(
    `/api/residents/${residentId}/allocations`,
    body
  );
  return data;
};

export const addWorkerToAllocation = async (
  type: string,
  residentId: number,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data } = await axios.post(
    `/api/residents/${residentId}/allocations?type=${type}`,
    body
  );
  return data;
};
export const deallocateTeamWorker = async (
  residentId: number,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data } = await axios.patch(
    `/api/residents/${residentId}/allocations?type=deallocate`,
    body
  );
  return data;
};

export const patchAllocation = async (
  residentId: number,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data } = await axios.patch(
    `/api/residents/${residentId}/allocations?type=edit`,
    body
  );
  return data;
};
