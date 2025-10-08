import "@mantine/core/styles.css";
import "./globals.css";

import { Loader } from "@mantine/core";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" color="blue" type="oval" />
        <p className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
          Preparing your experience…
        </p>
      </div>
    </div>
  );
}
