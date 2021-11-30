import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { deleteSubmission } from 'lib/submissions';
import { isAuthorised } from 'utils/auth';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case 'DELETE':
      {
        const user = isAuthorised(req);

        const submissionid = req.query.id as string;
        const deletedBy = user?.email as string;
        const deleteReason = req.query.deleteReason as string;
        const deleteRequestedBy = req.query.deleteRequestedBy as string;

        try {
          await deleteSubmission(
            submissionid,
            deletedBy,
            deleteReason,
            deleteRequestedBy
          );

          res.status(StatusCodes.NO_CONTENT).end();
        } catch (error) {
          console.error('Submission DELETE error:', error?.response?.data);

          error?.response?.status === StatusCodes.NOT_FOUND
            ? res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'Case Status Not Found' })
            : res.status(error?.response?.status).json({
                status: error?.response?.status,
                message: error?.response?.data,
              });
        }
      }
      break;
    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
      break;
  }
};

export default handler;
