import { getResident } from 'lib/residents';
import Layout from 'components/NewPersonView/Layout';
import { GetServerSideProps } from 'next';
import { Resident } from 'types';
import { isAuthorised } from '../../../utils/auth';
import { useMedia } from 'utils/api/media';
import FilterableMediaTiles from 'components/Media/FilterableMediaTiles';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import Spinner from 'components/Spinner/Spinner';

interface Props {
  person: Resident;
}

const PersonMediaPage = ({ person }: Props): React.ReactElement => {
  const { data: media, error } = useMedia(person.id);

  return (
    <Layout person={person}>
      {media ? (
        media.length > 0 ? (
          <FilterableMediaTiles media={media} />
        ) : (
          <p>No media to show</p>
        )
      ) : error ? (
        <ErrorMessage label={error.message} />
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

PersonMediaPage.goBackButton = true;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const user = isAuthorised(req);

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/login',
      },
    };
  }
  const person = await getResident(Number(params?.id), user);

  if (!person.id) {
    return {
      props: {},
      redirect: {
        destination: `/404`,
      },
    };
  }

  return {
    props: {
      person,
    },
  };
};

export default PersonMediaPage;
