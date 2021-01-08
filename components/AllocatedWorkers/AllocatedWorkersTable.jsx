import Modal from 'components/Modal/Modal';
import PropTypes from 'prop-types';
/* import LinkButton from '../LinkButton/LinkButton'; */
import Button from '../Form/Button/Button';
import { useState } from 'react';
import DeallocatedWorkersDetails from './DeallocateWorkerDetails/DeallocatedWorkerDetails';

const AllocatedWorkersEntry = ({
  allocatedWorkerTeam,
  allocatedWorker,
  allocationStartDate,
  allocationEndDate,
  workerType,
  index,
  callBack,
}) => {
  return (
    <>
      <div className="lbh-table-header">
        <h3 className="govuk-fieldset__legend--m govuk-custom-text-color govuk-!-margin-top-0">
          Allocated Worker {index + 1}
        </h3>
        {
          <Button isSecondary label="Deallocate Worker" onClick={callBack} />
          /* <LinkButton
             isSecondary
             label="Deallocate Worker"
             className="govuk-!-margin-bottom-3"
             route={`/people/${mosaicId}/allocated-worker/${id}/delete`}
           /> */
        }
      </div>
      <hr className="govuk-divider" />
      <div></div>
      <dl className="govuk-summary-list">
        {allocatedWorker && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Allocated Worker:</dt>
            <dd className="govuk-summary-list__value">{allocatedWorker}</dd>
          </div>
        )}
        {allocatedWorkerTeam && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Allocated Team</dt>
            <dd className="govuk-summary-list__value">{allocatedWorkerTeam}</dd>
          </div>
        )}
        {workerType && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Role</dt>
            <dd className="govuk-summary-list__value">{workerType}</dd>
          </div>
        )}
        {allocationStartDate && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Start Date</dt>
            <dd className="govuk-summary-list__value">
              {new Date(allocationStartDate).toLocaleDateString('en-GB')}
            </dd>
          </div>
        )}
        {allocationEndDate && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">End Date</dt>
            <dd className="govuk-summary-list__value">
              {new Date(allocationEndDate).toLocaleDateString('en-GB')}
            </dd>
          </div>
        )}
      </dl>
    </>
  );
};
const AllocatedWorkersTable = ({ records, personName }) => {
  const [selectedWorker, setSelectedWorker] = useState();
  return (
    <div>
      {records.map((result, index) => (
        <AllocatedWorkersEntry
          key={index}
          index={index}
          personName={personName}
          callBack={() => console.log(index) || setSelectedWorker(index)}
          {...result}
        />
      ))}
      <Modal
        isOpen={Boolean(selectedWorker !== undefined)}
        onRequestClose={() => setSelectedWorker()}
      >
        <DeallocatedWorkersDetails
          {...records[selectedWorker]}
          isLastWorker={records.length === 1}
        ></DeallocatedWorkersDetails>
      </Modal>
    </div>
  );
};

AllocatedWorkersTable.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      allocatedWorker: PropTypes.string,
      role: PropTypes.string,
      allocatedTeam: PropTypes.string,
      startDate: PropTypes.number,
      endDate: PropTypes.number,
      id: PropTypes.number,
      mosaicId: PropTypes.number,
    })
  ).isRequired,
};

export default AllocatedWorkersTable;
