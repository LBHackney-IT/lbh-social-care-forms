import {
  prettyCaseDate,
  prettyCaseTitle,
  prettyWorkerName,
} from 'lib/formatters';
import { Case } from 'types';
import s from './CaseNoteGrid.module.scss';
import Link from 'next/link';
import { truncate } from 'lib/utils';
import React from 'react';
import { generateInternalLink } from 'utils/urls';
import { useWorker } from 'utils/api/workers';

interface TileProps {
  c: Case;
}

const generateCaseLink = (c: Case): string => {
  if (c.formType === 'flexible-form')
    return `/people/${c.personId}/submissions/${c.recordId}`;
  if (c.caseFormUrl) return c.caseFormUrl;
  const intLink = generateInternalLink(c);
  return intLink || '';
};

const CaseNoteTile = ({ c }: TileProps) => {
  const { data } = useWorker({
    email: c.officerEmail || '',
  });

  const worker = data?.[0];

  return (
    <li key={c.recordId} className={s.tile}>
      <p className="lbh-body-xs">{prettyCaseDate(c)}</p>
      <h2 className="lbh-heading-h4">
        <Link href={generateCaseLink(c)}>
          <a>{prettyCaseTitle(c)}</a>
        </Link>
      </h2>

      <div aria-hidden="true" className={s.preview}>
        {c?.caseFormData?.case_note_description &&
          truncate(c.caseFormData.case_note_description || '', 20)}
      </div>

      <p className="lbh-body-xs">
        By {worker ? prettyWorkerName(worker) : c.officerEmail}
      </p>
    </li>
  );
};

interface Props {
  cases: Case[];
  size?: number;
  setSize?: (newSize: number) => void;
}

const CaseNoteGrid = ({ cases, size, setSize }: Props): React.ReactElement => (
  <>
    <ul className={s.grid}>
      {cases?.map((c) => (
        <CaseNoteTile key={c.recordId} c={c} />
      ))}
    </ul>

    {size && setSize && (
      <footer className={s.footer}>
        <button
          onClick={() => setSize(size + 1)}
          className="govuk-button lbh-button"
        >
          Load more
        </button>
        <p className="lbh-body-s">
          Looking for something specific? Try{' '}
          <Link href="/search">
            <a className="lbh-link lbh-link--no-visited-state">
              searching for it
            </a>
          </Link>
          .
        </p>
      </footer>
    )}
  </>
);

const CaseTileSkeleton = () => (
  <div className={s.tileSkeleton}>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export const CaseNoteGridSkeleton = (): React.ReactElement => (
  <div className={s.grid} aria-label="Loading...">
    <CaseTileSkeleton />
    <CaseTileSkeleton />
    <CaseTileSkeleton />
    <CaseTileSkeleton />
    <CaseTileSkeleton />
    <CaseTileSkeleton />
  </div>
);

export default CaseNoteGrid;
