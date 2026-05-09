// Custom error page for error states
export default function ErrorPage({ errorCode, message }: { errorCode?: number; message?: string }) {
  return (
    <div>
      <h1>Error {errorCode || ''}</h1>
      <p>{message || 'Something went wrong.'}</p>
    </div>
  );
}