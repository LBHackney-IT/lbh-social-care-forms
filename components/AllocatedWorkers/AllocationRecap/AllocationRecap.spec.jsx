import { render } from '@testing-library/react';

import AllocationRecap from './AllocationRecap';

import { useResidentAllocation } from 'utils/api/allocatedWorkers';
import { useCaseByResident } from 'utils/api/cases';

jest.mock('components/Spinner/Spinner', () => () => 'MockedSpinner');

jest.mock('utils/api/allocatedWorkers', () => ({
  useResidentAllocation: jest.fn(),
}));

jest.mock('utils/api/cases', () => ({
  useCaseByResident: jest.fn(),
}));

describe(`AllocationRecap`, () => {
  useCaseByResident.mockImplementation(() => ({
    data: {
      caseFormData: {
        form_name_overall: 'form name',
        created_by: 'creator',
        deallocation_reason: 'a valid reason',
      },
    },
  }));

  const props = {
    personId: 'p_123',
    allocationId: 'a_123',
    recordId: 'r_123',
  };

  it('should render properly on deallocation', async () => {
    useResidentAllocation.mockImplementation(() => ({
      data: {
        personName: 'person',
        allocatedWorker: 'worker',
        workerType: 'type',
        allocatedWorkerTeam: 'team',
        allocationStartDate: '2000-10-01',
        allocationEndDate: '2000-11-01',
        caseStatus: 'Closed',
      },
    }));
    const { asFragment } = render(<AllocationRecap {...props} />);
    expect(useResidentAllocation).toHaveBeenCalledWith('p_123', 'a_123');
    expect(useCaseByResident).toHaveBeenCalledWith('p_123', 'r_123');
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render properly on allocation', async () => {
    useResidentAllocation.mockImplementation(() => ({
      data: {
        personName: 'person',
        allocatedWorker: 'worker',
        workerType: 'type',
        allocatedWorkerTeam: 'team',
        allocationStartDate: '2000-10-01',
        caseStatus: 'Open',
      },
    }));
    const { asFragment } = render(<AllocationRecap {...props} />);
    expect(useResidentAllocation).toHaveBeenCalledWith('p_123', 'a_123');
    expect(useCaseByResident).toHaveBeenCalledWith('p_123', 'r_123');
    expect(asFragment()).toMatchSnapshot();
  });
});
