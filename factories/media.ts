import { Media } from 'types';
import { mockedResident } from 'factories/residents';
import { mockedWorker } from 'factories/workers';
import { mockSubmission } from './submissions';

export const mockedMedia: Media = {
  mediaId: 'abc123',
  title: 'Example media file',
  resident: mockedResident,
  uploadedBy: mockedWorker,
  uploadedAt: '2021-06-21T12:00:00.000Z',
  submission: mockSubmission,
  files: {
    original: {
      type: 'image/png',
      size: 20000000,
      url: 'http://placehold.it/3000x2000',
    },
    medium: {
      type: 'image/png',
      size: 200000,
      url: 'http://placehold.it/500x333',
    },
    thumbnail: {
      type: 'image/png',
      size: 20000,
      url: 'http://placehold.it/100x150',
    },
  },
};
