"use client";

import { SWRConfig } from "swr";
import { apiClient } from "@/lib/api";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => apiClient.get(url).then((res) => res.data),
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
