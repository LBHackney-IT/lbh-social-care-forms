import { render } from '@testing-library/react';
import CaseStatusDetailsTable from './CaseStatusDetailsTable';
import {
  mockedCaseStatusFactory,
  mockedStatusField,
} from 'factories/caseStatus';
import styles from './CaseStatusDetails.module.scss';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: 'path',
    push: jest.fn(),
  }),
  reload: jest.fn(),
}));

describe('CaseStatusDetailsTable component', () => {
  it('displays the table name if the table name is passed in', async () => {
    const { getByTestId } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({})}
        tableName={'Previous version'}
      />
    );
    const elements = getByTestId('case_status_table_title');
    expect(elements).not.toBeNull();
  });

  it('displays the start date', async () => {
    const { getByTestId } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({
          id: 1,
          type: 'CIN',
          startDate: '2021-09-09',
          endDate: '',
        })}
      />
    );

    const elements = getByTestId('start_date');
    expect(elements).not.toBeNull();
  });

  //Needs updated
  xit('displays the start and end date, if an end date exists', async () => {
    const { getByTestId } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({
          id: 1,
          type: 'CIN',
          startDate: '2021-09-09',
          endDate: '2021-09-10',
        })}
      />
    );

    const elements = getByTestId('start_end_date');
    expect(elements).not.toBeNull();
  });

  it('displays notes if they exist', async () => {
    const { queryByText } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({
          id: 1,
          type: 'CIN',
          startDate: '2021-09-09',
          endDate: '2021-09-10',
          notes: 'this is a note',
        })}
      />
    );

    expect(queryByText('this is a note')).toBeInTheDocument();
  });

  it('displays the table in a different style if a style is passed in', async () => {
    const { getByTestId } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({})}
        styleType={styles.scheduledStatusFont}
      />
    );
    const elements = getByTestId('case_status_details_table');
    expect(elements.className.includes('scheduledStatusFont')).toBe(true);
  });

  it('displays category of child protection plan for CP', async () => {
    const { getByTestId, queryByText } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({
          id: 1,
          type: 'CP',
          startDate: '2021-09-09',
          endDate: '2021-09-10',
          answers: [
            mockedStatusField.build({
              option: 'category',
              value: 'C2',
              startDate: '2021-09-09',
              createdAt: '2021-09-08',
            }),
          ],
        })}
      />
    );

    const elements = getByTestId('case_status_fields');
    expect(elements).not.toBeNull();
    expect(
      queryByText('Category of child protection plan')
    ).toBeInTheDocument();
    expect(queryByText('Physical abuse')).toBeInTheDocument();
  });

  it('displays legal status & placement type for LAC', async () => {
    const { getAllByTestId, queryByText } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({
          id: 1,
          type: 'LAC',
          startDate: '2021-09-09',
          endDate: '2021-09-10',
          answers: [
            mockedStatusField.build({
              option: 'legalStatus',
              value: 'C2',
              startDate: '2021-09-09',
              createdAt: '2021-09-08',
            }),
            mockedStatusField.build({
              option: 'placementType',
              value: 'R1',
              startDate: '2021-09-09',
              createdAt: '2021-09-08',
            }),
          ],
        })}
      />
    );

    const elements = getAllByTestId('case_status_fields');
    expect(elements.length).toBe(2);
    expect(queryByText('Legal status')).toBeInTheDocument();
    expect(queryByText('Placement type')).toBeInTheDocument();
    expect(queryByText('C2: Full care order')).toBeInTheDocument();
    expect(queryByText('R1: Residential care home')).toBeInTheDocument();
    expect(queryByText('Not the description')).not.toBeInTheDocument();
  });

  it('displays the case status field even if an invalid lookup id is passed', async () => {
    const { getByTestId, queryByText } = render(
      <CaseStatusDetailsTable
        status={mockedCaseStatusFactory.build({
          id: 1,
          type: 'CP',
          startDate: '2021-09-09',
          endDate: '2021-09-10',
          answers: [
            mockedStatusField.build({
              option: 'category',
              value: 'ZZZ1',
              startDate: '2021-09-09',
              createdAt: '2021-09-08',
            }),
          ],
        })}
      />
    );

    const elements = getByTestId('case_status_fields');
    expect(elements).not.toBeNull();
    expect(
      queryByText('Category of child protection plan')
    ).toBeInTheDocument();
    expect(queryByText('Not the category name')).not.toBeInTheDocument();
    expect(queryByText('ZZZ1')).toBeInTheDocument();
  });
});
