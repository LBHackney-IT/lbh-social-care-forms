import { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Modal/Modal';
import Button from 'components/Form/Button/Button';
import DeallocatedWorkersDetails from './DeallocateWorkerDetails/DeallocatedWorkerDetails';
import { useAuth } from 'components/UserContext/UserContext';

const AllocatedWorkersEntry = ({
  allocatedWorkerTeam,
  allocatedWorker,
  allocationStartDate,
  allocationEndDate,
  workerType,
  index,
  openModal,
}) => {
  const { user } = useAuth();
  return (
    <>
      <div className="lbh-table-header">
        <h3 className="govuk-fieldset__legend--m govuk-custom-text-color govuk-!-margin-top-0">
          Allocated Worker {index + 1}
        </h3>
        {user.hasAllocationsPermissions && (
          <Button isSecondary label="Deallocate Worker" onClick={openModal} />
        )}
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
          openModal={() => setSelectedWorker(index)}
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
      allocatedWorkerTeam: PropTypes.string.isRequired,
      allocatedWorker: PropTypes.string.isRequired,
      allocationStartDate: PropTypes.string.isRequired,
      allocationEndDate: PropTypes.string,
      workerType: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AllocatedWorkersTable;
