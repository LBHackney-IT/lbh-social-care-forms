import AllocatedCasesTable from 'components/AllocatedCases/AllocatedCasesTable';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { useMyAllocations } from 'utils/api/allocatedWorkers';
import Spinner from 'components/Spinner/Spinner';

const MyAllocatedCases = (): React.ReactElement => {
  const { data, error } = useMyAllocations();
  if (error) {
    return <ErrorMessage />;
  }
  if (!data) {
    return <Spinner />;
  }
  return (
    <>
      {data.allocations && (
        <>
          {data.allocations?.length > 0 ? (
            <>
              <p>
                Displaying ({data.allocations.length}){' '}
                {data.allocations.length > 1 ? 'allocations' : 'allocation'}
              </p>
              <AllocatedCasesTable cases={data.allocations} />
            </>
          ) : (
            <p className="govuk-body govuk-!-margin-top-5">
              No people are assigned to you
            </p>
          )}
        </>
      )}
    </>
  );
};

export default MyAllocatedCases;
