import { useRouter } from 'next/router';

import AddRelationshipForm from 'components/Relationships/AddRelationshipForm/AddRelationshipForm';

const AddRelationshipPage: React.FC = () => {
  const { query } = useRouter();
  const personId = Number(query.id as string);
  const secondPersonId = Number(query.secondPersonId);

  return (
    <AddRelationshipForm personId={personId} secondPersonId={secondPersonId} />
  );
};

export default AddRelationshipPage;
