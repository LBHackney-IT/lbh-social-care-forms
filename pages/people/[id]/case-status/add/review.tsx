import React from 'react';
import { useState } from 'react';
import FlexibleAnswers from 'components/FlexibleAnswers/FlexibleAnswers';
import { FlexibleAnswers as FlexibleAnswersT } from 'data/flexibleForms/forms.types';
import { useRouter } from 'next/router';
import { addCaseStatus } from 'utils/api/caseStatus';
import { useAuth } from 'components/UserContext/UserContext';
import { User, CaseStatusMapping } from 'types';
import PersonView from 'components/PersonView/PersonView';
import Button from 'components/Button/Button';
import Link from 'next/link';
import Banner from 'components/FlexibleForms/Banner';

const ReviewCaseStatusForm = (): React.ReactElement => {
  const [status, setStatus] = useState('');

  const router = useRouter();
  const { user } = useAuth() as { user: User };
  const personId = Number(router.query.id as string);
  const formAnswers = router.query;
  const valueMapping = new CaseStatusMapping();

  const submitAnswers = async () => {
    try {
      const { error } = await addCaseStatus({
        personId: personId,
        type: String(formAnswers.type),
        startDate: String(formAnswers.startDate),
        notes: String(formAnswers.notes),
        createdby: user.email,
      });

      if (error) throw error;

      router.push({
        pathname: `/people/${router.query.id}/details`,
        query: { flaggedStatus: true },
      });
    } catch (e) {
      setStatus(e.message);
    }
  };

  const displayValue: FlexibleAnswersT = {
    answers: {
      Type: [valueMapping[formAnswers.type as keyof CaseStatusMapping]],
      'Start date': String(formAnswers.startDate),
      Notes: String(formAnswers.notes),
    },
  };

  return (
    <PersonView personId={personId} expandView>
      <>
        {status && (
          <Banner
            title="There was a problem adding a case status"
            className="lbh-page-announcement--warning"
          >
            <p>Please refresh the page or try again later.</p>
            <p className="lbh-body-xs">{status}</p>
          </Banner>
        )}
        <h1 className="govuk-fieldset__legend--l gov-weight-lighter">
          Review case status details
        </h1>

        <FlexibleAnswers answers={displayValue} />

        <div>
          <p className="lbh-body">Do you want to add this case status?</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button label="Yes, add" onClick={submitAnswers} wideButton />
            <Link
              href={{
                pathname: `/people/${router.query.id}/case-status/add`,
                query: router.query,
              }}
              scroll={false}
            >
              <a
                className={`lbh-link lbh-link--no-visited-state govuk-!-margin-left-5`}
              >
                No, go back
              </a>
            </Link>
          </div>
        </div>
      </>
    </PersonView>
  );
};
ReviewCaseStatusForm.goBackButton = true;

export default ReviewCaseStatusForm;
