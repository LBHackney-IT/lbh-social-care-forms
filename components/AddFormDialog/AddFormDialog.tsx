import Dialog from 'components/Dialog/Dialog';
import SearchBox from 'components/SubmissionsTable/SearchBox';
import useSearch from 'hooks/useSearch';
import { useState } from 'react';
import { Resident, User } from 'types';
import s from './AddFormDialog.module.scss';
import Link from 'next/link';
import { useMemo, useEffect } from 'react';
import { useAuth } from 'components/UserContext/UserContext';

import ADULT_GFORMS from 'data/googleForms/adultForms';
import CHILD_GFORMS from 'data/googleForms/childForms';
import flexibleForms from 'data/flexibleForms';
import { populateChildForm } from 'utils/populate';
import { useFeatureFlags } from 'lib/feature-flags/feature-flags';

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  person: Resident;
}

const AddFormDialog = ({
  person,
  isOpen,
  onDismiss,
}: Props): React.ReactElement => {
  const { user } = useAuth() as { user: User };
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { isFeatureActive } = useFeatureFlags();

  useEffect(() => {
    setSearchQuery('');
  }, [isOpen]);

  const serviceContext = person.contextFlag;
  const gForms = serviceContext === 'A' ? ADULT_GFORMS : CHILD_GFORMS;

  interface Option {
    label: string;
    href: string;
    system: boolean;
    groupRecordable: boolean;
    approvable: boolean;
    inPreview: boolean;
  }

  const allForms: Option[] = useMemo(
    () =>
      flexibleForms
        .filter((f) => {
          // if user has elevated permissions, show all forms
          if (user.hasAdminPermissions || user.hasDevPermissions) return true;
          // otherwise, only show those relevant to current person's context
          return serviceContext === 'A'
            ? f.isViewableByAdults
            : f.isViewableByChildrens;
        })
        .map((f) => ({
          label: f.name,
          href: f.canonicalUrl
            ? f.canonicalUrl(person.id)
            : `/submissions/new?form_id=${f.id}&social_care_id=${person.id}`,
          system: true,
          groupRecordable: !!f.groupRecordable,
          approvable: !!f.approvable,
          inPreview: !f.isViewableByAdults && !f.isViewableByChildrens,
        }))
        .concat(
          gForms
            .map((f) => ({
              label: f.text,
              href: `${f.value}${populateChildForm(
                person.firstName,
                person.lastName,
                person.id,
                user.email,
                f.value
              )}`,
              system: false,
              groupRecordable: false,
              approvable: false,
              inPreview: false,
            }))
            .concat(
              isFeatureActive('workflows-pilot')
                ? {
                    label: 'Assessment, support plan or workflow',
                    href: `${process.env.NEXT_PUBLIC_WORKFLOWS_PILOT_URL}/workflows/new?social_care_id=${person.id}`,
                    system: true,
                    approvable: true,
                    groupRecordable: false,
                    inPreview: false,
                  }
                : []
            )
        ),

    [gForms, serviceContext, user, person]
  );

  const results = useSearch(
    searchQuery,
    allForms,
    ['label'],
    // more precise threshold gives better results
    { threshold: 0.3 },
    1
  );

  return (
    <Dialog title="Add something new" isOpen={isOpen} onDismiss={onDismiss}>
      <div>
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          label="Search for a form"
          placeholder="Search forms..."
        />
        <p className="lbh-body-xs">
          {results.length} {results.length === 1 ? 'match' : 'matches'}
        </p>
      </div>

      <ul className={s.resultsList}>
        {results.length === 0 && (
          <p className={`lbh-body-l ${s.noMatches}`}>No matches</p>
        )}
        {results.map((result, i) => (
          <li className={s.result} key={i}>
            <Link href={result.href}>
              <a
                target={result.system ? '' : '_blank'}
                className="lbh-link lbh-link--no-visited-state"
              >
                {result.label}
              </a>
            </Link>
            <p className={`lbh-body-xs ${s.meta}`}>
              {result.system ? 'System form' : 'Google form'}
              {result.inPreview && ' · In preview'}
              {result.approvable && ' · Needs manager approval'}
              {result.groupRecordable && ' · Allows group recording'}
            </p>

            <svg width="17" height="27" viewBox="0 0 17 27" fill="none">
              <path d="M2 25L14 13.3806L2 2" strokeWidth="4" />
            </svg>
          </li>
        ))}
      </ul>
    </Dialog>
  );
};

export default AddFormDialog;
