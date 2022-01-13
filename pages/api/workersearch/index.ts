import { StatusCodes } from 'http-status-codes';
import { isAuthorised } from 'utils/auth';

import { getWorkersThroughSearchQuery } from 'lib/workers';

import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

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
      try {
        console.log('This is before I have called the lib function');
        const data = await getWorkersThroughSearchQuery(
          req.query.workerName as string
        );
        console.log('I have called the lib function');
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        console.error('Workers gets an error:', error?.response?.data);
        error?.response?.status === StatusCodes.NOT_FOUND
          ? res
              .status(StatusCodes.NOT_FOUND)
              .json({ message: 'Worker Not Found' })
          : res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: 'Unable to get the worker' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};
export default endpoint;
