import { render, screen } from '@testing-library/react';
import {
  mockInProgressSubmission,
  mockInProgressSubmissionFactory,
} from 'factories/submissions';
import UnfinishedSubmissions from './UnfinishedSubmissions';
import * as submissionHooks from 'utils/api/submissions';
import { InProgressSubmission } from 'data/flexibleForms/forms.types';
import { SWRResponse } from 'swr';
import { Paginated, ErrorAPI } from 'types';

jest.mock('utils/api/submissions');
jest.mock('components/Spinner/Spinner', () => () => 'MockedSpinner');

describe('UnfinishedSubmissions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls useUnfinishedSubmissions with the provided PersonId', () => {
    const mockPersonId = 1;

    const mock = jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {},
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={mockPersonId} />);

    expect(mock).toHaveBeenCalledWith(mockPersonId);
  });

  it('renders a list of clickable submissions', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
            ] as InProgressSubmission[],
            count: 3,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('Unfinished submissions'));
    expect(screen.getAllByRole('listitem').length).toBe(4);
    expect(screen.getAllByRole('link').length).toBe(3);
  });

  it('truncates a long list', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
            ] as InProgressSubmission[],
            count: 6,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('and 2 more'));
    expect(screen.getAllByRole('listitem').length).toBe(5);
  });

  it('calculates item left based on response count', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
              mockInProgressSubmission,
            ] as InProgressSubmission[],
            count: 50,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('and 46 more'));
    expect(screen.getAllByRole('listitem').length).toBe(5);
  });

  it('displays the percentage of steps completed for a fully complete submission', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [mockInProgressSubmission] as InProgressSubmission[],
            count: 3,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('100% complete ·', { exact: false }));
  });

  it('displays the percentage of steps completed for an empty submission', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [
              mockInProgressSubmissionFactory.build({
                completedSteps: 0,
              }),
            ] as InProgressSubmission[],
            count: 3,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('0% complete ·', { exact: false }));
  });

  it('displays the percentage of steps correctly for a partially completed submission', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [
              mockInProgressSubmissionFactory.build({
                completedSteps: 2,
                formId: 'face-overview-assessment',
              }),
            ] as InProgressSubmission[],
            count: 3,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('7% complete ·', { exact: false }));
  });

  it('handles when we can not find the associated form for a submission', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [
              mockInProgressSubmissionFactory.build({
                formId: 'invalid form id',
              }),
            ] as InProgressSubmission[],
            count: 3,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('Unknown % complete · ', { exact: false }));
  });

  it('shows an error message when fetching unfinished submissions returns an error', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          error: {},
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(
      screen.getByText('There was a problem fetching unfinished submissions')
    );
  });

  it('shows loading spinner when fetching unfinished submissions', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          isValidating: true,
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('MockedSpinner'));
  });

  it('shows when there are no unfinished submissions', () => {
    jest
      .spyOn(submissionHooks, 'useUnfinishedSubmissions')
      .mockImplementation(() => {
        const response = {
          data: {
            items: [] as InProgressSubmission[],
            count: 0,
          },
        } as SWRResponse<Paginated<InProgressSubmission>, ErrorAPI>;

        return response;
      });

    render(<UnfinishedSubmissions personId={1} />);

    expect(screen.getByText('No unfinished submissions to show'));
  });

  // test showing form name when found

  // testing showing form-id when no valid form-name found
});
