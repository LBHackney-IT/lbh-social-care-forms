import { NextSeo } from 'next-seo';

import BackButton from 'components/Layout/BackButton/BackButton';
import Search from 'components/Search/Search';

const SearchPage = ({ query }) => {
  return (
    <div>
      <NextSeo title="Search" noindex />
      <BackButton />
      <h1>Person lookup</h1>
      <p className="govuk-body govuk-!-margin-bottom-7">
        Search for resident by Mosaic Id <strong>or</strong> Person Details to
        see if we have a record for them.
      </p>
      <Search query={query} />
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const { query } = ctx;
  return {
    props: {
      query,
    },
  };
};

export default SearchPage;
