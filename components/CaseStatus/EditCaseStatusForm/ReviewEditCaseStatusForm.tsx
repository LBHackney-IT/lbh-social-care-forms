import FlexibleAnswers from 'components/FlexibleAnswers/FlexibleAnswers';
import Button from 'components/Button/Button';
import Link from 'next/link';
import Banner from 'components/FlexibleForms/Banner';
import { User } from 'types';
import { FlexibleAnswers as FlexibleAnswersT } from 'data/flexibleForms/forms.types';
import { useState } from 'react';
import { patchCaseStatus } from 'utils/api/caseStatus';
import { useAuth } from 'components/UserContext/UserContext';
import { useRouter } from 'next/router';
import { useFormValues } from 'utils/api/caseStatus';
import { CaseStatusMapping } from 'types';

const ReviewAddCaseStatusForm: React.FC<{
  title: string;
  personId: number;
  caseStatusId: number;
  caseStatusType: string;
  formAnswers: any;
  action: string;
}> = ({
  title,
  personId,
  caseStatusId,
  caseStatusType,
  action,
  formAnswers,
}) => {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const { data: caseStatusFields } = useFormValues(caseStatusType);
  const { user } = useAuth() as { user: User };

  const valueMapping = new CaseStatusMapping();

  const submitAnswers = async () => {
    try {
      const patchObject = {
        editedBy: user.email,
        ...formAnswers,
      };

      const { error } = await patchCaseStatus(patchObject);

      if (error) throw error;

      router.push({
        pathname: `/people/${personId}/details`,
        query: {
          flaggedStatus: true,
          message:
            action == 'edit' ? 'Flagged status edited' : 'Flagged status ended',
        },
      });
    } catch (e) {
      setStatus(e.message);
    }
  };

  const diplayObj: any = {
    Type: valueMapping[caseStatusType as keyof CaseStatusMapping],
    'Start Date': formAnswers.startDate,
    'End Date': formAnswers.endDate,
    Notes: formAnswers.notes,
  };

  if (caseStatusFields) {
    caseStatusFields.fields.map((elmField) => {
      Object.keys(formAnswers).map((elm) => {
        if (elm === elmField.name) {
          diplayObj[elmField.description] = formAnswers[elm];
        }
      });
    });

    // console.log(caseStatusFields);
    console.log(formAnswers);
  }

  const displayValue: FlexibleAnswersT = {
    answers: {
      ...diplayObj,
    },
  };

  return (
    <>
      {status && (
        <Banner
          title="There was a problem editing the case status"
          className="lbh-page-announcement--warning"
        >
          <p>Please refresh the page or try again later.</p>
          <p className="lbh-body-xs">{status}</p>
        </Banner>
      )}
      <h1 className="govuk-fieldset__legend--l gov-weight-lighter">{title}</h1>

      <FlexibleAnswers answers={displayValue} />

      <div>
        <p className="lbh-body">Do you want to {action} this case status?</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button label={`Yes, ${action}`} onClick={submitAnswers} wideButton />
          <Link
            href={{
              pathname: `/people/${personId}/case-status/${caseStatusId}/edit/edit`,
              query: {
                prefilledFields: JSON.stringify(formAnswers),
                type: caseStatusType,
              },
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

export default ReviewAddCaseStatusForm;
