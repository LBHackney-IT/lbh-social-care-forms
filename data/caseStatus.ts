import {
  CaseStatus,
  CaseStatusFields,
  ChildProtectionCategoryOptions,
  LACLegalStatusOptions,
  LACPlacementTypeOptions,
  CaseStatusAnswer,
} from 'types';
import _ from 'lodash';

export enum CaseStatusOptionMapping {
  placementReason = 'Placement reason',
  category = 'Category of child protection plan',
  legalStatus = 'Legal status',
  placementType = 'Placement type',
}

export const CaseStatusSelectOptionLookup = (
  caseStatusAnswerValue: string,
  caseStatusAnswerOption: string
): string => {
  let returnString = '';
  switch (caseStatusAnswerOption) {
    case 'category':
      returnString =
        ChildProtectionCategoryOptions[
          caseStatusAnswerValue as keyof typeof ChildProtectionCategoryOptions
        ];
      break;
    case 'legalStatus':
      returnString =
        LACLegalStatusOptions[
          caseStatusAnswerValue as keyof typeof LACLegalStatusOptions
        ];
      break;
    case 'placementType':
      returnString =
        LACPlacementTypeOptions[
          caseStatusAnswerValue as keyof typeof LACPlacementTypeOptions
        ];
      break;
  }
  return returnString ? returnString : `${caseStatusAnswerValue}`;
};

export const sortCaseStatusAnswers = (
  caseStatuses: CaseStatus
): {
  currentStatusAnswers: CaseStatusAnswer[] | undefined;
  scheduledStatusAnswers?: CaseStatusAnswer[] | undefined;
  pastStatusAnswers?: CaseStatusAnswer[] | undefined;
} => {
  let currentStatus: CaseStatusFields[] | undefined;
  let scheduledStatus: CaseStatusFields[] | undefined;
  let pastStatus: CaseStatusFields[] | undefined;

  if (caseStatuses.type !== 'LAC') {
    if (caseStatuses.answers.length === 0) {
      currentStatus = undefined;
    } else {
      currentStatus = caseStatuses.answers;
    }
  } else {
    scheduledStatus = caseStatuses.answers.filter(
      (answer) => new Date(answer.startDate) > new Date()
    );
    pastStatus = caseStatuses.answers.filter(
      (answer) => new Date(answer.startDate) <= new Date()
    );
    if (pastStatus.length > 0) {
      let tempCurrentStatus = pastStatus[0];
      pastStatus.forEach((status) => {
        if (status.createdAt > tempCurrentStatus.createdAt) {
          tempCurrentStatus = status;
        }
      });

      // console.log(
      //   'multiple index?',
      //   pastStatus.findIndex(
      //     (i) =>
      //       i.createdAt === tempCurrentStatus?.createdAt &&
      //       i.startDate === tempCurrentStatus?.startDate
      //   )
      // );

      // console.log('tempCurrentStatus', tempCurrentStatus);

      // currentStatus = [...pastStatus];
      // console.log('currentStatus inital', currentStatus);
      // currentStatus.filter(
      //   (status) =>
      //     status.createdAt === tempCurrentStatus.createdAt &&
      //     status.startDate === tempCurrentStatus.startDate
      // );
      // console.log('current status filters', currentStatus);

      // pastStatus.filter(
      //   (status) =>
      //     status.createdAt !== tempCurrentStatus.createdAt &&
      //     status.startDate !== tempCurrentStatus.startDate
      // );
      let currentStatusIndex = -1;
      do {
        currentStatusIndex = pastStatus.findIndex(
          (i) =>
            i.createdAt === tempCurrentStatus.createdAt &&
            i.startDate === tempCurrentStatus.startDate
        );
        if (currentStatusIndex >= 0) {
          if (currentStatus === undefined) {
            currentStatus = [];
          }
          currentStatus.push(pastStatus[currentStatusIndex]);
          pastStatus.splice(currentStatusIndex, 1);
        }
      } while (currentStatusIndex >= 0);

      // let currentStatusIndices = []
      // forpastStatus.findIndex(
      //   (i) =>
      //     i.createdAt === tempCurrentStatus?.createdAt &&
      //     i.startDate === tempCurrentStatus?.startDate
      // );
      // for(let i = currentStatusIndices.length - 1; i <= 0; i-- ){
      //   currentStatus?.push(pastStatus[])
      // pastStatus.splice(currentStatusIndex, 1);}
    }
  }

  return {
    currentStatusAnswers: groupAnswersByStartDate(currentStatus),
    scheduledStatusAnswers: groupAnswersByStartDate(scheduledStatus),
    pastStatusAnswers: groupAnswersByStartDate(pastStatus),
  };
};

const groupAnswersByStartDate = (
  caseStatusAnswers: CaseStatusFields[] | undefined
): CaseStatusAnswer[] | undefined => {
  return caseStatusAnswers === undefined
    ? undefined
    : _.chain(caseStatusAnswers)
        .groupBy('startDate')
        .map((value, key) => ({ startDate: key, status: value }))
        .value()
        .sort((a, b) => {
          return Date.parse(b.startDate) - Date.parse(a.startDate);
        });
};

export const caseStatusesTest: CaseStatus[] = [
  {
    id: 2,
    type: 'CP',
    answers: [
      {
        option: 'category',
        value: 'C1',
        startDate: '2021-09-15',
        createdAt: '2021-09-01T10:54:32Z',
      },
    ],
    startDate: '2021-08-12T14:35:37.7023130',
    endDate: '',
    notes: 'this is a note',
  },
  {
    id: 1,
    type: 'CIN',
    answers: [],
    startDate: '2021-08-12T14:35:37.7023130',
    endDate: '',
    notes: 'this is a note',
  },
  {
    id: 3,
    type: 'LAC',
    answers: [
      {
        option: 'legalStatus',
        value: 'C1',
        startDate: '2021-10-15',
        createdAt: '2021-10-01T10:54:32Z',
      },
      {
        option: 'placementType',
        value: 'A3',
        startDate: '2021-10-15',
        createdAt: '2021-10-01T10:54:32Z',
      },
    ],

    startDate: '2021-08-12T14:35:37.7023130',
    endDate: '',
    notes: 'this is a note',
  },
];

export const LACcaseStatusesTest: CaseStatus[] = [
  {
    id: 4,
    type: 'LAC',
    answers: [
      {
        option: 'legalStatus',
        value: 'C1',
        startDate: '2021-07-02',
        createdAt: '2021-07-01T10:54:32Z',
      },
      {
        option: 'placementType',
        value: 'A3',
        startDate: '2021-07-02',
        createdAt: '2021-07-01T10:54:32Z',
      },
      {
        option: 'legalStatus',
        value: 'C1',
        startDate: '2021-08-02',
        createdAt: '2021-08-01T10:54:32Z',
      },
      {
        option: 'placementType',
        value: 'A3',
        startDate: '2021-08-02',
        createdAt: '2021-08-01T10:54:32Z',
      },
      {
        option: 'legalStatus',
        value: 'C2',
        startDate: '2021-10-15',
        createdAt: '2021-10-01T10:54:32Z',
      },
      {
        option: 'placementType',
        value: 'A4',
        startDate: '2021-10-15',
        createdAt: '2021-10-01T10:54:32Z',
      },
      {
        option: 'legalStatus',
        value: 'D1',
        startDate: '2021-09-15',
        createdAt: '2021-09-01T10:54:32Z',
      },
      {
        option: 'placementType',
        value: 'A5',
        startDate: '2021-09-15',
        createdAt: '2021-09-01T10:54:32Z',
      },
    ],
    startDate: '2021-08-02T14:35:37.7023130',
    endDate: '',
    notes: '',
  },
];

// const scheduledCaseStatus: CaseStatus[] = [
//   {
//     answers: [
//       {
//         name: 'legalStatus',
//         description: "What is the child's legal status?",
//         //update selected option lac_legal_status_options
//         selectedOption: { description: 'Interim care order', name: 'C1' },
//       },
//       {
//         name: 'placementType',
//         description: 'What is the placement type?',
//         //update selected option lac_placement_type_options
//         selectedOption: {
//           description:
//             'Placed for adoption with parental/guardian consent with current foster carer(s) (under Section 19 of the Adoption and Children Act 2002) or with a freeing order where parental/guardian consent has been given (under Section 18(1)(a) of the Adoption Act 1976)',
//           name: 'A3',
//         },
//       },
//     ],
//     endDate: '2021-08-13T14:35:37.7023130',
//     id: 3,
//     notes: 'this is a note',
//     startDate: '2021-08-12T14:35:37.7023130',
//     type: 'LAC',
//   },
// ];
