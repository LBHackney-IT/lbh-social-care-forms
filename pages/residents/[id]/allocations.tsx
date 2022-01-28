import Collapsible from 'components/ResidentPage/Collapsible';
import Layout from 'components/ResidentPage/Layout';
import { getResident } from 'lib/residents';
import { GetServerSideProps } from 'next';
import { Resident } from 'types';
import { useAllocatedWorkers } from 'utils/api/allocatedWorkers';
import { isAuthorised } from 'utils/auth';
import Link from 'next/link';
import SummaryList from 'components/ResidentPage/SummaryList';
import { formatDate } from 'utils/date';

interface Props {
  resident: Resident;
}

const AllocationsPage = ({ resident }: Props): React.ReactElement => {
  const { data } = useAllocatedWorkers(resident.id);

  const allocations = data?.allocations;

  return (
    <Layout resident={resident} title="Allocations">
      <>
        {allocations?.map((a) => (
          <Collapsible
            key={a.id}
            title={a.allocatedWorker}
            link={
              <Link href={`/people/${resident.id}/allocations/${a.id}/remove`}>
                <a className="lbh-link lbh-link--muted">Deallocate</a>
              </Link>
            }
          >
            <SummaryList
              rows={{
                Role: a.workerType,
                Team: (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_CORE_PATHWAY_APP_URL}/teams/${a.allocatedWorkerTeam}`}
                  >
                    <a>{a.allocatedWorkerTeam}</a>
                  </Link>
                ),
                Duration: `${formatDate(a.allocationStartDate)} — ${
                  a.allocationEndDate
                    ? formatDate(a.allocationEndDate)
                    : 'present'
                }`,
              }}
            />
          </Collapsible>
        ))}
        <Link href={`/people/${resident.id}/allocations/add`}>
          <a className="govuk-button lbh-button lbh-button--secondary lbh-button--add">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M6.94 0L5 0V12H6.94V0Z" />
              <path d="M12 5H0V7H12V5Z" />
            </svg>
            Allocate someone else
          </a>
        </Link>
      </>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const user = isAuthorised(req);

  // redirect unauthorised users to login
  if (!user) {
    return {
      props: {},
      redirect: {
        destination: `/login`,
      },
    };
  }

  const resident = await getResident(Number(params?.id), user);

  // does the resident exist?
  if (!resident.id) {
    return {
      props: {},
      redirect: {
        destination: `/404`,
      },
    };
  }

  return {
    props: {
      resident,
    },
  };
};

export default AllocationsPage;
