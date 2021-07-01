import PersonView from 'components/PersonView/PersonView';
import PersonDetails from 'components/PersonView/PersonDetails';
import Cases from 'components/Cases/Cases';
import AllocatedWorkers from 'components/AllocatedWorkers/AllocatedWorkers';
import Relationships from 'components/Relationships/Relationships';
import WarningNotes from 'components/WarningNote/WarningNotes';
import Stack from 'components/Stack/Stack';
import { canViewRelationships } from 'lib/permissions';
import { useAuth } from '../../UserContext/UserContext';
import { User } from '../../../types';

export const PersonDetailsPage: React.FC<{ personId: number }> = ({
  personId,
}) => {
  const { user } = useAuth() as { user: User };

  return (
    <PersonView personId={personId} showPersonDetails={false}>
      {(person) => (
        <Stack space={7} className="govuk-!-margin-top-7">
          <WarningNotes id={personId} />
          <PersonDetails person={person} />
          <AllocatedWorkers person={person} />
          {canViewRelationships(user, person) ? (
            <Relationships id={personId} />
          ) : (
            <></>
          )}
          <Cases id={personId} person={person} />
        </Stack>
      )}
    </PersonView>
  );
};
