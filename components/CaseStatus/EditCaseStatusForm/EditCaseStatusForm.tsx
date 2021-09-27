import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import CASE_STATUS_CIN_EDIT from 'data/flexibleForms/caseStatus/editCINCaseStatus';
import CASE_STATUS_CP_EDIT from 'data/flexibleForms/caseStatus/editCPCaseStatus';
import CASE_STATUS_LAC_EDIT from 'data/flexibleForms/caseStatus/editLACCaseStatus';
import CASE_STATUS_LAC_UPDATE from 'data/flexibleForms/caseStatus/updateLACCaseStatus';
import CASE_STATUS_LAC_END from 'data/flexibleForms/caseStatus/endLACCaseStatus';
import CASE_STATUS_END from 'data/flexibleForms/caseStatus/endCINCPCaseStatus';
import { generateInitialValues } from 'lib/utils';
import { generateFlexibleSchema } from 'lib/validators';
import FlexibleField from 'components/FlexibleForms/FlexibleFields';
import Button from 'components/Button/Button';
import { CaseStatus } from 'types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCaseStatuses } from 'utils/api/caseStatus';
import { format } from 'date-fns';

const EditCaseStatusForm: React.FC<{
  personId: number;
  caseStatusId: number;
  prefilledFields: any;
  caseStatusType: string;
  action: string;
}> = ({ personId, caseStatusId, caseStatusType, prefilledFields, action }) => {
  const router = useRouter();
  const { data: caseStatusData } = useCaseStatuses(personId);

  let form_fields: any;
  if (prefilledFields && prefilledFields['action']) {
    action = prefilledFields['action'];
  }

  if (action == 'edit' && caseStatusType == 'CIN') {
    form_fields = CASE_STATUS_CIN_EDIT.steps[0].fields;
  } else if (action == 'edit' && caseStatusType == 'CP') {
    form_fields = CASE_STATUS_CP_EDIT.steps[0].fields;
  } else if (action == 'edit' && caseStatusType == 'LAC') {
    form_fields = CASE_STATUS_LAC_EDIT.steps[0].fields;
  } else if (action == 'end' && caseStatusType == 'LAC') {
    form_fields = CASE_STATUS_LAC_END.steps[0].fields;
  } else if (action == 'end') {
    form_fields = CASE_STATUS_END.steps[0].fields;
  } else if (action == 'update') {
    form_fields = CASE_STATUS_LAC_UPDATE.steps[0].fields;
  }

  if (action === 'edit' && caseStatusData) {
    caseStatusData.caseStatuses.map((status: CaseStatus) => {
      if (status.id == caseStatusId) {
        form_fields.map((field: any) => {
          if (field.id === 'notes') {
            field.default = String(status.notes);
          }
          if (field.id === 'startDate') {
            field.default = format(new Date(status.startDate), 'yyyy-MM-dd');
          }
          status.fields.map((preloaded_field) => {
            if (preloaded_field.name === field.id) {
              field.default = preloaded_field.selectedOption.name;
            }
          });
        });
      }
    });
  }

  if (prefilledFields) {
    form_fields.map((field: any) => {
      if (prefilledFields[field.id]) {
        field.default = prefilledFields[field.id];
      }
    });
  }

  const handleSubmit = async (
    values: FormikValues,
    { setStatus }: FormikHelpers<FormikValues>
  ) => {
    try {
      router.push({
        pathname: `/people/${personId}/case-status/${caseStatusId}/edit/review`,
        query: {
          action: action,
          type: caseStatusType,
          ...values,
        },
      });
    } catch (e) {
      setStatus(e.toString());
    }
  };

  return (
    <Formik
      initialValues={generateInitialValues(form_fields)}
      validationSchema={generateFlexibleSchema(form_fields)}
      onSubmit={handleSubmit}
    >
      {({ touched, errors, values }) => (
        <Form>
          {form_fields.map((field: any) => (
            <FlexibleField
              key={field.id}
              field={field}
              values={values}
              errors={errors}
              touched={touched}
            />
          ))}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              label="Continue"
              disabled={values.endDate == '' || Object.keys(errors).length > 0}
              type="submit"
              data-testid="submit_button"
              wideButton
            />
            <Link
              href={{
                pathname: `/people/${personId}/case-status/${caseStatusId}/edit`,
                query: { action: action, type: caseStatusType },
              }}
              scroll={false}
            >
              <a
                className={`lbh-link lbh-link--no-visited-state govuk-!-margin-left-3`}
              >
                Cancel
              </a>
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditCaseStatusForm;
