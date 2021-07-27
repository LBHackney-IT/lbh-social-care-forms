import Dialog from 'components/Dialog/Dialog';
import { Media } from 'types';
import { format } from 'date-fns';
import s from './index.module.scss';

interface Props {
  media: Media;
  isOpen: boolean;
  onDismiss: () => void;
}

const humanFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0.0 B';
  }
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, e)).toFixed(1) + ' ' + ' KMGTP'.charAt(e) + 'B'
  );
};

const MediaDetailDialog = ({
  media,
  isOpen,
  onDismiss,
}: Props): React.ReactElement => {
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} title={media.title}>
      <img
        src={media.files.medium?.url}
        alt={media.title}
        loading="lazy"
        className={`govuk-!-margin-bottom-6 ${s.imgPreview}`}
      />

      <dl className={`govuk-summary-list lbh-summary-list`}>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Uploaded</dt>
          <dd className="govuk-summary-list__value">
            {format(new Date(media.uploadedAt), 'd MMM yyyy HH:mm')}
            <br />
            {media.uploadedBy?.email}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">File</dt>
          <dd className="govuk-summary-list__value">
            {media.files.original.type}
            <br />
            {humanFileSize(media.files.original.size)}
          </dd>
        </div>
      </dl>
    </Dialog>
  );
};

export default MediaDetailDialog;
