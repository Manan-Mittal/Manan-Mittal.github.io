import { useEffect } from 'react';

const NotFound = ({ path }: { path: string }) => {
  useEffect(() => {
    console.error('404: no route at', path);
  }, [path]);

  return (
    <div className="room-light flex min-h-screen items-center justify-center bg-roast-950 px-6">
      <div className="panel max-w-md p-10 text-center">
        <p className="kicker">Error 404</p>
        <h1 className="mt-4 font-display text-5xl text-cream">We’re out of that.</h1>
        <p className="mt-4 text-cream-dim">
          Nothing is brewing at <code className="font-mono text-[0.85rem] text-crema">{path}</code>.
          The bar is still open, though.
        </p>
        <a href="/" className="btn-crema mt-8">
          Back to the bar
        </a>
      </div>
    </div>
  );
};

export default NotFound;
