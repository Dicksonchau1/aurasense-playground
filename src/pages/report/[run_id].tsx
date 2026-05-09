import { useParams } from 'react-router-dom';
export default function ReportPage() {
  const { run_id } = useParams();
  return <div>Report Page (/report/{'{run_id}'})</div>;
}