import axios from 'axios';
import {
  finishSubmission,
  getSubmissionById,
  getUnfinishedSubmissions,
  patchResidents,
  patchSubmissionForStep,
  startSubmission,
  approveSubmission,
  returnForEdits,
  discardSubmission,
} from './submissions';
import { mockedLegacyResident } from 'factories/residents';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const { ENDPOINT_API, AWS_KEY } = process.env;

describe('getUnfinishedSubmissions', () => {
  it('should return a list of incomplete submissions', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { submissionId: '123', formAnswers: {} },
        { submissionId: '456', formAnswers: {} },
      ],
    });
    const data = await getUnfinishedSubmissions();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions`,
      { headers: { 'x-api-key': AWS_KEY } }
    );
    expect(data).toEqual([
      { submissionId: '123', formAnswers: {} },
      { submissionId: '456', formAnswers: {} },
    ]);
  });

  it('only returns submissions in the requested age context', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          submissionId: '123',
          formAnswers: {},
          residents: [mockedLegacyResident],
        },
        {
          submissionId: '456',
          formAnswers: {},
          residents: [
            {
              ...mockedLegacyResident,
              ageContext: 'C',
            },
          ],
        },
      ],
    });
    const data = await getUnfinishedSubmissions('A');
    expect(data).toEqual([
      {
        submissionId: '123',
        formAnswers: {},
        residents: [mockedLegacyResident],
      },
    ]);
  });
});

describe('startSubmission', () => {
  it('should work properly', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { submissionId: '123' },
    });
    const data = await startSubmission('foo', 123, 'bar');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions`,
      { formId: 'foo', socialCareId: 123, createdBy: 'bar' },
      { headers: { 'x-api-key': AWS_KEY } }
    );
    expect(data).toEqual({
      submissionId: '123',
    });
  });
});

describe('getSubmissionById', () => {
  it('should work properly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { submissionId: '123', formAnswers: {} },
    });
    const data = await getSubmissionById('123');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions/123`,
      { headers: { 'x-api-key': AWS_KEY } }
    );

    expect(data).toEqual({ submissionId: '123', formAnswers: {} });
  });
});

describe('patchResidents', () => {
  it('should work properly', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { submissionId: '123' },
    });
    await patchResidents('123', 'foo@example.com', [1, 2]);
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions/123`,
      { editedBy: 'foo@example.com', residents: [1, 2] },
      { headers: { 'x-api-key': AWS_KEY } }
    );
  });
});

describe('finishSubmission', () => {
  it('should work properly', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { submissionId: '123' },
    });

    await finishSubmission('foo', 'bar');
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions/foo`,
      { editedBy: 'bar', submissionState: 'submitted' },
      { headers: { 'x-api-key': AWS_KEY } }
    );
  });
});

describe('discardSubmission', () => {
  it('should work properly', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { submissionId: '123' },
    });

    await discardSubmission('foo', 'bar');
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions/foo`,
      { editedBy: 'bar', submissionState: 'discarded' },
      { headers: { 'x-api-key': AWS_KEY } }
    );
  });
});

describe('patchSubmissionForStep', () => {
  it('should work properly', async () => {
    const mockAnswers = {
      'question one': 'answer one',
      'question two': 'answer two',
      Tags: ['foo', 'bar'],
    };

    mockedAxios.patch.mockResolvedValue({
      data: { submissionId: '123', formAnswers: {} },
    });
    const data = await patchSubmissionForStep('123', '456', 'foo', mockAnswers);
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${ENDPOINT_API}/submissions/123/steps/456`,
      {
        editedBy: 'foo',
        stepAnswers: JSON.stringify(mockAnswers),
        tags: ['foo', 'bar'],
      },
      { headers: { 'x-api-key': AWS_KEY } }
    );
    expect(data).toEqual({
      submissionId: '123',
      formAnswers: {},
    });
  });
});

describe('approveSubmission', () => {
  it('should work properly', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { submissionId: '123' },
    });

    await approveSubmission('foo', 'bar');
    expect(mockedAxios.patch).toHaveBeenCalled();
    expect(mockedAxios.patch.mock.calls[0][0]).toEqual(
      `${ENDPOINT_API}/submissions/foo`
    );
    expect(mockedAxios.patch.mock.calls[0][1]).toEqual({
      editedBy: 'bar',
      submissionState: 'approved',
    });
    expect(mockedAxios.patch.mock.calls[0][2]?.headers).toEqual({
      'x-api-key': AWS_KEY,
    });
  });
});

describe('returnForEdits', () => {
  it('should work properly', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { submissionId: '123' },
    });

    await returnForEdits('foo', 'bar', 'test reason');
    expect(mockedAxios.patch).toHaveBeenCalled();
    expect(mockedAxios.patch.mock.calls[0][0]).toEqual(
      `${ENDPOINT_API}/submissions/foo`
    );
    expect(mockedAxios.patch.mock.calls[0][1]).toEqual({
      editedBy: 'bar',
      submissionState: 'in_progress',
      rejectionReason: 'test reason',
    });
    expect(mockedAxios.patch.mock.calls[0][2]?.headers).toEqual({
      'x-api-key': AWS_KEY,
    });
  });
});
