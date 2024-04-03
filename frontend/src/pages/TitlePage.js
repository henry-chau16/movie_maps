import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function TitlePage() {
  const { titleId } = useParams();

  return (
    <div>
      <Navigation/>
      <h2>Title ID: {titleId}</h2>
    </div>
  );
}



