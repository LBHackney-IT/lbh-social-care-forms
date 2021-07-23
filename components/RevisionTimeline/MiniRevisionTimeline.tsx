import { format } from 'date-fns';
import { Submission } from 'data/flexibleForms/forms.types';
import s from './MiniRevisionTimeline.module.scss';

interface Props {
  submission: Submission;
}

const RevisionTimeline = ({ submission }: Props): React.ReactElement | null => {
  // reverse the array so it's in reverse-chronological order and take the three most recent events
  const revisions = Array.from(submission.editHistory).reverse().slice(0, 3);

  return (
    <ol className={`lbh-timeline ${s.timeline}`}>
      {revisions.map((revision, i) => (
        <li
          className={`lbh-timeline__event lbh-timeline__event--minor ${s.event}`}
          key={i}
        >
          <h3 className="lbh-body-s">{revision.worker.email}</h3>

          <p className="lbh-body-xs">
            {format(new Date(revision.editTime), 'dd MMM yyyy K.mm aaa')}
          </p>
        </li>
      ))}
    </ol>
  );
};

export default RevisionTimeline;
