import FormWizard from 'components/FormWizard/FormWizard';

import ReferralDetails from 'components/Steps/referral-details';
import CaseNotes from 'components/Steps/case-notes';

const FORM_PATH = '/form/adult-referral/';
const FORM_STEPS = [
  {
    id: 'client-details',
    title: 'Client Details',
    components: [
      {
        component: 'DateInput',
        name: 'dateOfContact',
        label: 'Date of contact',
        rules: { required: true },
        hint: 'For example, 31 03 1980',
      },
      {
        component: 'TextInput',
        name: 'mosaic_id',
        width: '30',
        label: 'Mosaic ID Number',
        hint: 'For example 0123456789',
        rules: { required: true },
      },
      {
        component: 'TextInput',
        name: 'nhsNumber',
        width: '30',
        label: 'NHS Number',
        hint: 'For example 0123456789',
      },
      { component: 'TextInput', name: 'title', width: '30', label: 'Title' },
      {
        component: 'TextInput',
        name: 'lastName',
        width: '30',
        label: 'Surname',
        rules: { required: true },
      },
      {
        component: 'TextInput',
        name: 'firstName',
        width: '30',
        label: 'First Name',
        rules: { required: true },
      },
      {
        component: 'TextInput',
        name: 'otherNames',
        width: '30',
        label: 'Other Names',
      },
      {
        component: 'DateInput',
        name: 'dateOfBirth',
        label: 'Date of Birth',
        hint: 'For example, 31 03 1980',
        rules: { required: true },
      },
      {
        component: 'NationalityList',
        name: 'nationality',
        label: 'Nationality',
        rules: { required: true },
      },
      {
        component: 'Radios',
        name: 'gender',
        label: 'Gender',
        options: ['Female', 'Male', 'Unknown', 'Other'],
        rules: { required: true },
      },
      {
        component: 'TextInput',
        name: 'addressLine1',
        width: '30',
        label: 'Primary Address',
        rules: { required: true },
      },
      {
        component: 'TextInput',
        name: 'postCode',
        width: '30',
        label: 'Post Code',
        rules: { required: true },
      },
      {
        component: 'TextInput',
        name: 'phone',
        width: '30',
        label: 'Phone Number',
      },
    ],
  },
  {
    id: 'referral-details',
    component: ReferralDetails,
    title: 'Referral Details',
  },
  { id: 'case-notes', component: CaseNotes, title: 'Case Notes' },
];

const AdultReferral = () => (
  <FormWizard
    formPath={FORM_PATH}
    formSteps={FORM_STEPS}
    title="Create New Record"
  />
);

export default AdultReferral;
