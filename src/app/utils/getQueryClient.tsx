import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";

import axiosInstance from "../api/requests/axios";

const pathSeparator = "/";

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: ({ queryKey }) =>
            axiosInstance
              .get(queryKey.join(pathSeparator))
              .then(({ data }) => data),
        },
      },
    })
);


export default getQueryClient;
