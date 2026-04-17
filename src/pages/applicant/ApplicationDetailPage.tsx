import { useParams } from 'react-router-dom';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export default function ApplicantApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <PlaceholderPage
      title="Application detail"
      subtitle={`Viewing application ${id ?? '—'}. Ranked programs, docs, interviews, offer.`}
    />
  );
}
