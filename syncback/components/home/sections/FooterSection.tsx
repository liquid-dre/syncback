import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 py-10 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">SyncBack</p>
          <p className="text-sm text-slate-500">Feedback that finds you first.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <Link href="#tour" className="transition hover:text-slate-900">
            Contact
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            Offerings
          </Link>
        </div>
      </div>
    </footer>
  );
}
