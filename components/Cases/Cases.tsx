import CasesTable from 'components/Cases/CasesTable';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import ErrorSummary from 'components/ErrorSummary/ErrorSummary';
import Button from 'components/Button/Button';
import Spinner from 'components/Spinner/Spinner';
import { useAuth } from 'components/UserContext/UserContext';
import { useCasesByResident } from 'utils/api/cases';

import { Case, Resident, User } from 'types';

interface Props {
  id: number;
}

const Cases = ({ id }: Props): React.ReactElement => {
  const { data, size, setSize, error } = useCasesByResident(id);
  const results =
    data && data.length > 0
      ? {
          cases: data.reduce<Case[]>(
            (acc, { cases }) => [...acc, ...cases],
            []
          ),
          nextCursor: data[data.length - 1].nextCursor,
        }
      : null;
  if (error) {
    return <ErrorMessage />;
  }
  if (!data || !results) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <>
      {results.cases.length > 0 ? (
        <CasesTable
          records={results.cases}
          columns={['date_of_event', 'formName', 'officer_email', 'action']}
        />
      ) : (
        <p className="lbh-body govuk-!-margin-top-5">No records found.</p>
      )}
      <div style={{ height: '50px', textAlign: 'center' }}>
        {size > data.length ? (
          <Spinner />
        ) : (
          results.nextCursor && (
            <Button label="Load more" onClick={() => setSize(size + 1)} />
          )
        )}
      </div>
    </>
  );
};

interface WrapperProps {
  id: number;
  person: Resident;
}

const CasesWrapper = ({ id, person }: WrapperProps): React.ReactElement => {
  const { user } = useAuth() as { user: User };
  return (
    <div>
      <h3 className="lbh-heading-h2 section-heading">Records history</h3>
      <p className="lbh-body">Linked files are read only.</p>
      <Button label="Add a new record" route={`${id}/records`} />
      {user.hasUnrestrictedPermissions || !person.restricted ? (
        <Cases id={id} />
      ) : (
        <ErrorSummary
          title="RESTRICTED"
          body="The records for this profile are restricted for viewing"
        />
      )}
    </div>
  );
};

export default CasesWrapper;
