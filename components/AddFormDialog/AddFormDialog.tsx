import Dialog from 'components/Dialog/Dialog';
import SearchBox from 'components/SubmissionsTable/SearchBox';
import useSearch from 'hooks/useSearch';
import { useState } from 'react';
import { Resident } from 'types';
import { Form } from 'data/flexibleForms/forms.types';
import s from './AddFormDialog.module.scss';
import Link from 'next/link';

import ADULT_GFORMS from 'data/googleForms/adultForms';
import CHILD_GFORMS from 'data/googleForms/childForms';
import flexibleForms from 'data/flexibleForms';
import { useEffect } from 'react';

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
  const serviceContext = person.contextFlag;

  const gForms = serviceContext === 'A' ? ADULT_GFORMS : CHILD_GFORMS;

  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setSearchQuery('');
  }, [isOpen]);

  // interface Option {
  //   label: string;
  //   href: string;
  //   system?: boolean;
  //   approvable?: boolean;
  //   groupRecordable?: boolean;
  // }

  const options = flexibleForms
    .map((form) => ({
      label: form.name,
      href: `/submissions/new?form_id=${form.id}&social_care_id=${person.id}`,
      system: true,
      approvable: form.approvable,
      groupRecordable: form.groupRecordable,
    }))
    .concat(
      gForms.map((form) => ({
        label: form.text,
        href: form.value,
      }))
    );

  const results = useSearch(
    searchQuery,
    options,
    ['label'],
    {
      threshold: 0.3,
    },
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

        <p className="lbh-body-xs">{results.length} matches</p>
      </div>
      <ul className={s.resultsList}>
        {results.map((result) => (
          <li className={s.result} key={result.href}>
            <Link href={result.href}>
              <a
                target={!result.system && '_blank'}
                className="lbh-link lbh-link--no-visited-state"
              >
                {result.label}
              </a>
            </Link>
            <p className={`lbh-body-xs ${s.meta}`}>
              {result.system ? 'System form' : 'Google form'}
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
