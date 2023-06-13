"use client";
import React from "react";
import {
  dehydrate,
  hydrate,
  useQuery,
  useHydrate,
  QueryClient,
} from "@tanstack/react-query";
import axios from "@/app/api/requests/axios";
import { List } from "@/app/types/List";
import CreateList from "../components/CreateList.component";
import ListComponent from "../components/List.component";

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["posts"], () =>
    axios.get<List[]>(`/list`).then(({ data }) => data)
  );
  console.log(dehydrate(queryClient));
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const DashboardPage = () => {
  console.log();
  const listQuery = useQuery({
    queryKey: ["list"],
    queryFn: () => axios.get<List[]>("/list").then(({ data }) => data),
    refetchInterval: 5000,
  });
  const [createList, setCreateList] = React.useState<number[]>([]);
  const deleteNewList = (id: number) => {
    setCreateList((prev) => prev.filter((item) => item !== id));
  };
  return (
    <div
      style={{
        background:
          "linear-gradient(124.65deg, #6268FF 16.66%, #8E05E8 47.24%, #FF00D6 93.31%)",
      }}
      className="w-[100vw] h-[100vh] flex flex-col items-center justify-center] p-8"
    >
      <div className="h-full w-full pb-4">
        {listQuery.isLoading ? (
          <div className="h-full flex items-center justify-center">
            <h1 className="animate-pulse text-white text-4xl font-bold">
              Loading?
            </h1>
          </div>
        ) : (
          listQuery.data && (
            <div className="w-full h-full flex flex-col items-center justify-center overflow-x-hidden">
              <h1 className="text-white text-4xl h-16 font-extrabold pt-16">
                ToDo App.
              </h1>
              <div className="lg:w-1/2 md:w-1/2 sm:w-full xs:w-full w-full mt-20 flex flex-col items-center overflow-y-auto">
                <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 my-2">
                  <div className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-center text-md font-semibold text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <button
                      onClick={() =>
                        setCreateList(
                          createList.length === 0
                            ? [createList.length++]
                            : [...createList, createList.length++]
                        )
                      }
                    >
                      New list
                    </button>
                  </div>
                </div>
                {createList.map((item) => {
                  return (
                    <div
                      key={item}
                      className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 my-2"
                    >
                      <CreateList id={item} deleteNewList={deleteNewList} />
                    </div>
                  );
                })}
                {listQuery.data.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 my-2"
                    >
                      <ListComponent list={item} />
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
