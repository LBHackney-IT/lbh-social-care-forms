import { useState } from 'react';
import { Media } from 'types';
import s from './index.module.scss';
import MediaDetailDialog from './MediaDetailDialog';
import { format } from 'date-fns';

interface Props {
  media: Media;
}

const MediaTile = ({ media }: Props): React.ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <li className={s.tile}>
      <img src={media.files.medium?.url} alt={media.title} loading="lazy" />

      <div className={s.tileMeta}>
        <button onClick={() => setOpen(true)}>
          <h3 className="lbh-heading-h4">{media.title}</h3>
        </button>
        <p className="lbh-body-xs">
          Uploaded {format(new Date(media.uploadedAt), 'd MMM yyyy')}
          {media.uploadedBy && ` by ${media.uploadedBy.email}`}
        </p>
      </div>

      <MediaDetailDialog
        media={media}
        isOpen={open}
        onDismiss={() => setOpen(false)}
      />
    </li>
  );
};

export default MediaTile;
