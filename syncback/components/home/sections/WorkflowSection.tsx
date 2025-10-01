const steps = [
  {
    title: "Create your SyncBack space",
    description:
      "Add a business name, drop in the email that should be notified, and generate your branded QR poster.",
  },
  {
    title: "Print, post, or display anywhere",
    description:
      "Place the QR code at checkout, tables, or digital screens. Customers land on a delightful feedback form.",
  },
  {
    title: "Collect insights in real time",
    description:
      "Every submission includes a star rating, open feedback, and device info so you always have actionable context.",
  },
] as const;

export function WorkflowSection() {
  return (
    <section className="js-section-workflow grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-900/10 backdrop-blur">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workflow</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">From scan to inbox in a heartbeat.</h2>
        <p className="mt-4 text-base text-slate-600">
          SyncBack was designed for busy teams that value clarity over clutter. Every step is purposefully light so you can move
          from setup to actionable feedback in minutes.
        </p>
        <div className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative pl-12">
              <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/20">
                <span className="text-base font-semibold">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-br from-sky-200/70 via-indigo-200/40 to-transparent blur-2xl" aria-hidden />
        <div className="relative w-full max-w-xl rounded-[40px] border border-white/80 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Live session</p>
            <p className="mt-4 text-2xl font-semibold">Guest Feedback Board</p>
            <div className="mt-6 space-y-4 text-sm text-white/80">
              <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <span>⭐️⭐️⭐️⭐️⭐️</span>
                <span className="text-white/70">2 mins ago</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">“Front desk was so welcoming. Keep the smiles coming!”</div>
              <div className="rounded-2xl bg-white/10 p-4">“Tables were spotless and QR flow was effortless.”</div>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-sm text-slate-600 shadow-sm backdrop-blur">
            Your team is automatically looped in with actionable emails—no dashboards required.
          </div>
        </div>
      </div>
    </section>
  );
}
