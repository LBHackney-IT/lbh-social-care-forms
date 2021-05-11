import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import Spinner from 'components/Spinner/Spinner';
import Summary from 'components/Summary/Summary';
import { useCase } from 'utils/api/cases';
import * as form from 'data/forms';
import { FormStep } from 'components/Form/types';

interface Props {
  personId: number;
  recordId: string;
}

const CaseNote = ({ personId, recordId }: Props): React.ReactElement => {
  const { data: record, error: recordError } = useCase(recordId);

  const recordData = record?.caseFormData?.form_name_overall;
  const fileData =
    recordData && (form as Record<string, FormStep[]>)[recordData];

  console.log(recordError, recordData, fileData);

  if (recordError || (recordData && !fileData)) {
    return <ErrorMessage />;
  }
  if (!record || !fileData) {
    return <Spinner />;
  }

  return (
    <>
      <Summary
        formData={record.caseFormData}
        formSteps={fileData}
        formPath={`/people/${personId}/records/${recordId}/`}
      />
    </>
  );
};

export default CaseNote;
