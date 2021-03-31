import { SavedForms } from 'components/SaveFormData/SaveFormData';

const FormInProgress = (): React.ReactElement => (
  <>
    <h1 className="lbh-heading-h1 govuk-!-margin-bottom-8">Incomplete forms</h1>
    <SavedForms />
  </>
);

export default FormInProgress;
