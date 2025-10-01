const testimonials = [
  {
    quote: "SyncBack turned passive guests into active advocates overnight. We spot service slips before they hit reviews.",
    name: "Jasmine Lee",
    role: "Operations Lead, Wildflower Cafè",
  },
  {
    quote: "Our QR cards sit on every conference table. Speakers love the instant praise—and the constructive nudges.",
    name: "Omar Silva",
    role: "Event Director, Thrive Collective",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="js-section-testimonials rounded-[32px] border border-white/70 bg-white/70 p-10 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Loved by teams</span>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Real teams, real-time improvements.</h2>
          <p className="text-base text-slate-600">
            SyncBack keeps the spotlight on customer joy. The more you listen, the faster you iterate.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map(({ quote, name, role }) => (
            <div
              key={name}
              className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
            >
              <p className="text-base text-slate-700">{quote}</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
