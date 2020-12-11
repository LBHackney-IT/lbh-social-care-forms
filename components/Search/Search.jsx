import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import SearchResidentsForm from './forms/SearchResidentsForm';
import SearchCasesForm from './forms/SearchCasesForm';
import ResidentsTable from './results/ResidentsTable';
import CasesTable from './results/CasesTable';

import { Button } from 'components/Form';
import Spinner from 'components/Spinner/Spinner';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import UserContext from 'components/UserContext/UserContext';

import { getResidents } from 'utils/api/residents';
import { getCases } from 'utils/api/cases';
import { getPermissionFilter } from 'utils/user';
import { getQueryString } from 'utils/urls';

const getRecords = (data) => [
  ...(data.residents || []),
  ...(data?.cases || []),
];

const Search = ({ query, type }) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState();
  const [formData, setFormData] = useState();
  const [sort, setSort] = useState({
    sort_by: query.sort_by,
    order_by: query.order_by,
  });
  const { user } = useContext(UserContext);
  const { pathname, replace } = useRouter();
  const permission = useMemo(() => getPermissionFilter(user), []);
  const { SearchForm, SearchResults, searchFunction } = useMemo(
    () =>
      type === 'cases'
        ? {
            SearchForm: SearchCasesForm,
            SearchResults: CasesTable,
            searchFunction: ({ my_notes_only, ...formData }) =>
              console.table({ my_notes_only, ...formData }) ||
              getCases({
                ...formData,
                worker_email: my_notes_only ? user.email : '',
              }),
          }
        : {
            SearchForm: SearchResidentsForm,
            SearchResults: ResidentsTable,
            searchFunction: getResidents,
          },
    []
  );
  const onFormSubmit = useCallback(async (formData, records = []) => {
    setLoading(true);
    !formData.cursor && setResults(null);
    setError(null);
    try {
      setFormData(formData);
      const data = await searchFunction({
        ...formData,
        context_flag: permission,
      });
      setLoading(false);
      setResults({
        ...data,
        records: [...records, ...getRecords(data)],
      });
      const qs = getQueryString(formData);
      replace(`${pathname}?${qs}`, `${pathname}?${qs}`, {
        shallow: true,
      });
    } catch (e) {
      setLoading(false);
      setError(e.response?.data || 'Oops an error occurred');
    }
  });
  // commented out as the feature is not ready in the BE
  // eslint-disable-next-line no-unused-vars
  const onSort = useCallback((value) => {
    const { order_by, sort_by } = sort;
    setSort(
      sort_by === value && order_by === 'desc'
        ? { order_by: 'asc', sort_by }
        : { order_by: 'desc', sort_by: value }
    );
  });
  useEffect(() => {
    results && sort.sort_by && onFormSubmit({ ...formData, ...sort });
  }, [sort]);
  return (
    <>
      <h1 className="govuk-heading-l">Search</h1>
      <p className="govuk-body govuk-!-margin-bottom-5">
        Use search to find a person before adding a new person or record.
        Records will need to be linked to person.
      </p>
      <div className="govuk-tabs">
        <h2 className="govuk-tabs__title">Contents</h2>
        <ul className="govuk-tabs__list">
          <li
            className={cx('govuk-tabs__list-item', {
              'govuk-tabs__list-item--selected': type !== 'cases',
            })}
          >
            <Link href="/" scroll={false}>
              <a className="govuk-tabs__tab">Search for a person</a>
            </Link>
          </li>
          <li
            className={cx('govuk-tabs__list-item', {
              'govuk-tabs__list-item--selected': type === 'cases',
            })}
          >
            <Link href="/cases" scroll={false}>
              <a className="govuk-tabs__tab">Search for records by person</a>
            </Link>
          </li>
        </ul>
        <div className="govuk-tabs__panel">
          <p className="govuk-body govuk-!-margin-bottom-5">
            {type === 'cases'
              ? 'Search and filter by any combination of fields'
              : 'Search for a person by any combination of fields below'}
          </p>
          <SearchForm onFormSubmit={onFormSubmit} query={query} user={user} />
          {results && (
            <>
              <h2 className="govuk-fieldset__legend--m govuk-custom-text-color">
                {type.toUpperCase()} SEARCH RESULT
              </h2>
              <hr className="govuk-divider" />
              <SearchResults
                records={results.records}
                sort={sort}
                // onSort={onSort} commented out as the feature is not ready in the BE
              />
            </>
          )}
          <div style={{ height: '50px', textAlign: 'center' }}>
            {loading ? (
              <Spinner />
            ) : (
              results?.nextCursor && (
                <Button
                  label="load more"
                  onClick={() =>
                    onFormSubmit(
                      { ...formData, cursor: results.nextCursor },
                      results.records
                    )
                  }
                />
              )
            )}
          </div>
          {error && <ErrorMessage label={error} />}
        </div>
      </div>
    </>
  );
};

Search.propTypes = {
  type: PropTypes.oneOf(['people', 'cases']).isRequired,
  query: PropTypes.shape({}),
};

export default Search;
