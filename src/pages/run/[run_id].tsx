import { useParams } from 'react-router-dom';
export default function RunPage() {
  const { run_id } = useParams();
  return <div>Run Page (/run/{'{run_id}'})</div>;
}