import useSWR, { responseInterface } from 'swr';
import axios from 'axios';

import type { WarningNote, ErrorAPI } from 'types';

export const useWarningNotes = (
  id: number
): responseInterface<WarningNote[], ErrorAPI> =>
  useSWR(`/api/residents/${id}/warning-notes`);
