import useSWR, { SWRResponse } from 'swr';
import type { ErrorAPI, Media } from 'types';

/** fetch unfinished submissions in the user's current service context, either for everyone, or by social care id */
export const useMedia = (
  socialCareId?: number
): SWRResponse<Media[], ErrorAPI> =>
  useSWR(`/api/residents/${socialCareId}/media`);
