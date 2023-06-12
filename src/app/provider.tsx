"use client";
import {
    QueryClientProvider,
    QueryClient,
  } from "@tanstack/react-query";
  import React from "react";
  import axiosInstance from "../app/api/requests/axios";
  
  export default function Providers({ children }: React.PropsWithChildren) {
    const [queryClient] = React.useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              queryFn: ({ queryKey }) =>
                axiosInstance.get(queryKey.join("/")).then(({ data }) => data),
                refetchInterval: 5000,
            },
          },
        })
    );
  
    return (
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
    );
  }