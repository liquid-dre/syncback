"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
    </ClerkProvider>
  );
}
