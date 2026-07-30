import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-background text-light-foreground gap-4 px-6 text-center">
      <h1 className="text-2xl font-heading">Something went wrong</h1>
      <p className="text-light-foreground/60 max-w-md">
        {error?.message || 'An unexpected error occurred while rendering this page.'}
      </p>
      <a href="/" className="text-accent-teal underline">
        Go back home
      </a>
    </div>
  );
}
