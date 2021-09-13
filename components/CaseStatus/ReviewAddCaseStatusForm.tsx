import FlexibleAnswers from 'components/FlexibleAnswers/FlexibleAnswers';
import Button from 'components/Button/Button';
import Link from 'next/link';
import Banner from 'components/FlexibleForms/Banner';
import { User, CaseStatusMapping } from 'types';
import { FlexibleAnswers as FlexibleAnswersT } from 'data/flexibleForms/forms.types';
import { useState } from 'react';
import { addCaseStatus } from 'utils/api/caseStatus';
import { useAuth } from 'components/UserContext/UserContext';
import { useRouter } from 'next/router';

const ReviewAddRelationshipForm: React.FC<{
  title: string;
  personId: number;
  formAnswers: any;
}> = ({ title, personId, formAnswers }) => {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const { user } = useAuth() as { user: User };

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
        pathname: `/people/${personId}/details`,
        query: { flaggedStatus: true },
      });
    } catch (e) {
      setStatus(e.message);
    }
  };

  const displayValue: FlexibleAnswersT = {
    answers: {
      Type: [valueMapping[formAnswers.type as keyof CaseStatusMapping]],
      'Start date': new Date(formAnswers.startDate).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      ),
      Notes: String(formAnswers.notes),
    },
  };

  return (
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
      <h1 className="govuk-fieldset__legend--l gov-weight-lighter">{title}</h1>

      <FlexibleAnswers answers={displayValue} />

      <div>
        <p className="lbh-body">Do you want to add this case status?</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button label="Yes, add" onClick={submitAnswers} wideButton />
          <Link
            href={{
              pathname: `/people/${personId}/case-status/add`,
              query: formAnswers,
            }}
            scroll={false}
          >
            <a
              className={`lbh-link lbh-link--no-visited-state govuk-!-margin-left-5`}
            >
              No, cancel
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ReviewAddRelationshipForm;
