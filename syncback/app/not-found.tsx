import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center bg-gradient-to-b from-white via-[#f5f7ff] to-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-20">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">404 error</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Something is not right...
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              The page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to
              another URL. If you think this is an error, contact support.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow-md hover:scale-115 hover:bg-blue-400 sm:w-auto"
              >
                Get back to home page
              </Link>
            </div>
          </div>

          <div className="order-1 mx-auto h-72 w-full max-w-sm lg:order-2 lg:hidden">
            <Image src="/not-found-illustration.svg" alt="Person exploring a map on a tablet" width={400} height={400} priority className="h-full w-full object-contain" />
          </div>

          <div className="relative order-3 hidden justify-center lg:flex">
            <div className="relative h-[420px] w-full max-w-sm">
              <Image src="/not-found-illustration.svg" alt="Person exploring a map on a tablet" fill priority className="object-contain" sizes="(min-width: 1024px) 320px, 100vw" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
