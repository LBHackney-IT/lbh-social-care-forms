import Link from 'next/link';
import { Resident, Allocation } from 'types';

export interface Props {
  resident: Resident;
  allocation: Allocation;
}

export const getRatingString = (rating: keyof typeof ratingMapping): string => {
  return ratingMapping[rating];
};
export const getRatingColour = (rating: keyof typeof colorMapping): string => {
  return colorMapping[rating];
};

const ratingMapping = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'No priority',
};

const colorMapping = {
  urgent: 'purple',
  high: 'red',
  medium: 'orange',
  low: 'green',
  none: 'grey',
};

const PriorityRating = ({
  resident,
  allocation,
}: Props): React.ReactElement => {
  const style = {
    height: '12px',
    width: '12px',
    display: 'inline-block',
    backgroundColor: '#bbb',
    borderRadius: '50%',
  };

  if (allocation.ragRating) {
    style.backgroundColor = getRatingColour(
      allocation.ragRating.toLowerCase() as keyof typeof colorMapping
    );
  }

  return (
    <>
      {allocation.ragRating ? (
        <>
          {`${getRatingString(
            allocation.ragRating.toLowerCase() as keyof typeof ratingMapping
          )} `}
          <span data-testid="colourdot" style={style}></span>
        </>
      ) : (
        <>No priority</>
      )}

      <span style={{ float: 'right', margin: '0 -18px 0 0' }}>
        <Link
          href={`/residents/${resident.id}/allocations/${allocation.id}/editpriority`}
        >
          <a className="lbh-link lbh-link--muted">Edit</a>
        </Link>
      </span>
    </>
  );
};

export default PriorityRating;
