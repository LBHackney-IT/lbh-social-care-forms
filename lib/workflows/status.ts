import { Workflow, WorkflowType } from 'components/ResidentPage/types';

/** statuses a workflow can have */
export enum Status {
  InProgress = 'INPROGRESS',
  Submitted = 'SUBMITTED',
  ManagerApproved = 'MANAGERAPPROVED',
  NoAction = 'NOACTION',
  ReviewSoon = 'REVIEWSOON',
  Overdue = 'OVERDUE',
  Discarded = 'DISCARDED',
}

/** convert enum values to pretty strings for display */
export const prettyStatuses = {
  [Status.InProgress]: 'In progress',
  [Status.Discarded]: 'Discarded',
  [Status.Submitted]: 'Waiting for approval',
  [Status.ManagerApproved]: 'Waiting for QAM',
  [Status.NoAction]: 'Completed',
  [Status.Overdue]: 'Review overdue',
  [Status.ReviewSoon]: 'Review soon',
};

/** determine the current stage of a workflow for logic */
export const getStatus = (workflow: Workflow): Status => {
  // the order of these determines priority
  if (workflow.discardedAt) return Status.Discarded;

  if (
    workflow.type === WorkflowType.Historic ||
    workflow.panelApprovedAt ||
    (workflow.managerApprovedAt && !workflow.needsPanelApproval)
  ) {
    // if (DateTime.fromISO(String(workflow.reviewBefore)) < DateTime.local()) {
    //   return Status.Overdue;
    // } else if (
    //   DateTime.fromISO(String(workflow.reviewBefore)).diffNow() <
    //   Duration.fromObject({
    //     months: 1,
    //   })
    // ) {
    //   return Status.ReviewSoon;
    // } else {
    return Status.NoAction;
    // }
  }

  if (workflow.managerApprovedAt) {
    if (workflow.needsPanelApproval) {
      return Status.ManagerApproved;
    } else {
      return Status.NoAction;
    }
  }
  if (workflow.submittedAt) return Status.Submitted;
  return Status.InProgress;
};

/** get status of a workflow for display */
export const prettyStatus = (workflow: Workflow): string => {
  const status = getStatus(workflow);

  switch (status) {
    // case Status.ReviewSoon:
    //   return `Review due ${prettyDateToNow(String(workflow.reviewBefore))}`;
    //   break;
    default:
      return prettyStatuses[status];
      break;
  }
};
