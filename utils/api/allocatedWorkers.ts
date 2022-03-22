import useSWR, { SWRResponse } from 'swr';
import axios from 'axios';

import type {
  AgeContext,
  Allocation,
  AllocationData,
  ErrorAPI,
  Team,
  Worker,
} from 'types';

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
}): SWRResponse<{ teams: Team[] }, ErrorAPI> =>
  useSWR(`/api/teams${ageContext ? '?ageContext=' + ageContext : ''}`);

export const useTeamWorkers = (
  teamId?: number
): SWRResponse<Worker[], ErrorAPI> =>
  useSWR(teamId ? `/api/teams/${teamId}/workers` : null);

export const useAllocationsByWorker = (
  workerId: number
): SWRResponse<{ allocations: Allocation[]; workers: Worker[] }, ErrorAPI> =>
  useSWR(`/api/workers/${workerId}/allocations`);

export const deleteAllocatedWorker = async (
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
