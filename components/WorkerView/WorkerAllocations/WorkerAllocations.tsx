import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { useAllocationsByWorker } from 'utils/api/allocatedWorkers';
import Radios from 'components/Form/Radios/Radios';
import React, { useState } from 'react';
import { Allocation } from 'types';
import s from './WorkerAllocations.module.scss';
import { getRatingCSSColour } from 'components/PriorityRating/PriorityRating';
import { capitalize } from 'lib/formatters';
import classNames from 'classnames';
import Link from 'next/link';
import { formatDistance, isToday } from 'date-fns';

interface WorkerAllocationssListProps {
  workerId: number;
}

interface WorkerAllocationsProps {
  allocation: Allocation;
}

export const WorkerAllocations = ({
  allocation,
}: WorkerAllocationsProps): React.ReactElement => {
  if (!allocation.ragRating) allocation.ragRating = 'none';

  const color = getRatingCSSColour(allocation.ragRating.toLowerCase());
  const style = { backgroundColor: color, color: 'white' };
  if (allocation.ragRating == 'medium') {
    style['color'] = 'black';
  }

  const residentLine = (
    <>
      {allocation.ragRating && (
        <span className={s.ragRating} style={style}>
          {capitalize(allocation.ragRating)}
        </span>
      )}
      <span className={s.residentName}>
        <Link href={`/residents/${allocation.personId}`}>
          <a
            className={classNames('lbh-link lbh-link--no-visited-state')}
            style={{ textDecoration: 'none' }}
          >
            {allocation.personName}
          </a>
        </Link>
      </span>
      <span className={s.residentId}> #{allocation.personId} </span>
    </>
  );

  const allocationDate = new Date(allocation.allocationStartDate);

  return (
    <>
      {residentLine}
      <div className={s.rowDescription}>
        <span className={s.workerAllocation}>
          <b>Worker allocation:</b>
          <span data-testid="dateSpan" className={s.elementValue}>
            {' '}
            {allocation.allocatedWorker}
            {' on '}
            {allocationDate.toLocaleDateString()}
            {' ('}
            {isToday(allocationDate)
              ? 'Today'
              : formatDistance(allocationDate, new Date(), { addSuffix: true })}
            {') '}
          </span>
        </span>
      </div>
    </>
  );
};

const WorkerAllocationssList = ({
  workerId,
}: WorkerAllocationssListProps): React.ReactElement => {
  const [sortBy, setSortBy] = useState<string>('rag_rating');

  const { data: allocatedWorkerData, error } = useAllocationsByWorker(
    workerId,
    {
      sort_by: sortBy,
    }
  );

  if (error) {
    return (
      <ErrorMessage label="There was a problem with worker allocations." />
    );
  }
  return (
    <>
      {allocatedWorkerData?.allocations?.length ? (
        <table>
          <tbody>
            <tr>
              <td style={{ paddingRight: '10px', verticalAlign: 'middle' }}>
                Sort by
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Radios
                  name="sort"
                  options={[
                    { value: 'rag_rating', text: 'Priority' },
                    { value: 'date_added', text: 'Date added to team' },
                  ]}
                  defaultValue={sortBy}
                  onChange={(elm) => {
                    setSortBy(elm.target.value);
                  }}
                  isRadiosInline={true}
                />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        ''
      )}
      <ul style={{ marginTop: '0px' }}>
        {allocatedWorkerData?.allocations?.length ? (
          allocatedWorkerData.allocations.map((elm: Allocation) => (
            <li key={elm.id} className={classNames('lbh-body-s', s.listItem)}>
              <WorkerAllocations allocation={elm} />
            </li>
          ))
        ) : (
          <p>No people are assigned to you</p>
        )}
      </ul>
    </>
  );
};
export default WorkerAllocationssList;
