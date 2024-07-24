import { useRouteError } from "react-router-dom";

export function NotFoundPage() {
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);

  return (
    <div className="min-h-screen bg-slate-900 py-16">
      <div className="mx-auto flex h-full flex-col gap-4 px-4 max-xl:max-w-screen-sm min-[1280px]:max-w-screen-md">
        <div id="error-page">
          <h1 className="text-7xl text-slate-200">Oops!</h1>
          <div className="py-8">
            <iframe
              className="pointer-events-none h-96 w-full rounded-lg"
              src="https://imgflip.com/embed/8y2x0g"
            ></iframe>
          </div>
          <p className="text-2xl text-slate-200">
            Um erro inesperado aconteceu.
          </p>
          <div className="mt-8 rounded-lg bg-slate-400 p-8">
            <p>Detalhes:</p>
            <p>
              <i className="text-red-900">
                {error?.statusText || error?.message}
              </i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
