import * as HttpStatus from 'http-status-codes';

import { useResidents, addResident } from 'utils/server/residents';
import { isAuthorised } from 'utils/auth';

export default async (req, res) => {
  const user = isAuthorised(req);
  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).end();
  }
  if (!user.isAuthorised) {
    return res.status(HttpStatus.FORBIDDEN).end();
  }
  switch (req.method) {
    case 'GET':
      try {
        const data = await useResidents({
          ...req.query,
          context_flag: user.permissionFlag,
        });
        res.status(HttpStatus.OK).json(data);
      } catch (error) {
        console.error('Residents get error:', error?.response?.data);
        error?.response?.status === HttpStatus.NOT_FOUND
          ? res
              .status(HttpStatus.NOT_FOUND)
              .json({ message: 'Residents Not Found' })
          : res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Unable to get the Residents' });
      }
      break;

    case 'POST':
      try {
        const data = await addResident(req.body);
        res.status(HttpStatus.OK).json(data);
      } catch (error) {
        console.error('Resident post error:', error?.response?.data);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to add resident' });
      }
      break;

    default:
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};
