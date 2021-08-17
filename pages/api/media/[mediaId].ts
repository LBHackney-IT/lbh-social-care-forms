import { StatusCodes } from 'http-status-codes';
import { isAuthorised } from 'utils/auth';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getMediaById } from 'lib/media';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const user = isAuthorised(req);
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }
  if (!user.isAuthorised) {
    return res.status(StatusCodes.FORBIDDEN).end();
  }

  switch (req.method) {
    case 'GET':
      res.json(await getMediaById(req.query.mediaId as string));
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;
