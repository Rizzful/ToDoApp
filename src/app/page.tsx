import { dehydrate } from "@tanstack/react-query";
import Hydrate from "./utils/hydrate.client";
import getQueryClient from "./utils/getQueryClient";
import { getLists } from "./api/requests/api";

import DashboardPage from "./pages/dashboard/page";

export default async function App() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["list"], getLists);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <DashboardPage />
    </Hydrate>
  );
}
