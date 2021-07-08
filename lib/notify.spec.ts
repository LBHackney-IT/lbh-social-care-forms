import { mockSubmission } from 'factories/submissions';
import { notifyApprover, notifyReturnedForEdits } from './notify';
import { NotifyClient } from 'notifications-node-client';
import { waitFor } from '@testing-library/react';

const mockSend = jest.fn();

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => {
      return { sendEmail: mockSend };
    }),
  };
});

beforeEach(() => {
  NotifyClient.mockClear();
});

describe('notifyApprover', () => {
  it('correctly calls the notify client', async () => {
    await notifyApprover(mockSubmission, 'bar', 'http://example.com');
    await waitFor(() => {
      expect(mockSend).toBeCalledTimes(1);
      expect(mockSend).toBeCalledWith(
        process.env.NOTIFY_APPROVER_TEMPLATE_ID,
        'bar',
        {
          personalisation: {
            form_name: 'Foo',
            resident_name: 'Foo Bar',
            started_by: 'foo@bar.com',
            url: 'http://example.com/people/1/submissions/123',
          },
          reference: '123-bar',
        }
      );
    });
  });
});

describe('notifyReturnedForEdits', () => {
  it('correctly calls the notify client', async () => {
    await notifyReturnedForEdits(
      mockSubmission,
      'bar',
      'http://example.com',
      'my reason'
    );
    await waitFor(() => {
      expect(mockSend).toBeCalledTimes(1);
      expect(mockSend).toBeCalledWith(
        process.env.NOTIFY_RETURN_FOR_EDITS_TEMPLATE_ID,
        'foo@bar.com',
        {
          personalisation: {
            rejecter_email: 'bar',
            form_name: 'Foo',
            reason: 'my reason',
            resident_name: 'Foo Bar',
            started_by: 'foo@bar.com',
            url: 'http://example.com/submissions/123',
          },
          reference: '123-bar',
        }
      );
    });
  });
});
