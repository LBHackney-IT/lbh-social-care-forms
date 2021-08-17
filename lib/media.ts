import { mockedMedia } from 'factories/media';
import { Media } from 'types';

/** get all media associated with a resident by social care id */
export const getMedia = async (socialCareId: number): Promise<Media[]> => {
  socialCareId;
  return [
    mockedMedia,
    mockedMedia,
    mockedMedia,
    mockedMedia,
    mockedMedia,
    mockedMedia,
  ];
};

/** get a particular media object by its id */
export const getMediaById = async (mediaId: string): Promise<Media> => {
  mediaId;
  return mockedMedia;
};
