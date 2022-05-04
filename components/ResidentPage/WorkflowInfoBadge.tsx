import useWorkflowIds from 'hooks/useWorkflowIds';
import { WorkflowType } from './types';
import s from './WorkflowInfoBadge.module.scss';

export const WorkflowInfoBadge = (workflowId: string): React.ReactElement => {
  const { data, error } = useWorkflowIds(workflowId, 1);

  return (
    <div className={s.badge}>
      {(data?.workflows[0].type === WorkflowType.Review ||
        data?.workflows[0].type === WorkflowType.Reassessment) && (
        <span className="govuk-tag lbh-tag" data-testid="workflow-info">
          {data?.workflows[0].type}
        </span>
      )}

      {error && (
        <span
          className="govuk-tag lbh-tag lbh-tag--grey"
          data-testid="workflow-info"
        >
          Unknown
        </span>
      )}
    </div>
  );
};

export default WorkflowInfoBadge;
