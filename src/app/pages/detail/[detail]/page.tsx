"use client";
import { List } from "@/app/types/List";
import { useRouter } from "next/navigation";
import React from "react";
import CreateItem from "../../components/CreateItem.component";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/app/api/requests/axios";
import { Item } from "@/app/types/Item";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { TrashIcon } from "@heroicons/react/24/outline";
import ModalComponent from "../../components/Modal.component";
import { ModalConfig } from "@/app/types/Modal";
import ItemComponent from "../../components/Item.component";

// export async function generateStaticParams() {
//   const ids = GetAllListIds();

//   return (
//     ids &&
//     ids.map((id) => id && ({
//       detail: id,
//     }))
//   );
// }

// export function getStaticPaths(): { paths: { params: { detail: number } }[]; fallback: boolean }{
//   const paths = GetAllListIds();
//   return paths ? ({
//     paths,
//     fallback: false,
//   }) : (
//     { paths: 
//       [{ params: { detail: 0 }, }], 
//       fallback: false, }
//   )
// }

// export const GetAllListIds = () => {
//   const listQuery = useQuery({
//     queryKey: ["list"],
//     queryFn: () => axios.get<List[]>("/list").then(({ data }) => data),
//     refetchInterval: 5000,
//   });
//   return (
//     listQuery.data &&
//     listQuery.data.map((item) => {
//       return {
//         params: {
//           detail: item.id,
//         },
//       };
//     })
//   );
// }

const DetailPage = ({ params }: { params: { detail: number } }) => {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [modal, setModal] = React.useState<ModalConfig>({
    open: false,
    type: "confirm",
    title: "",
    description: "",
    options: [],
    close: () => {},
  });
  const { detail: listId } = params;
  const [createItem, setCreateItem] = React.useState<number[]>([]);
  const data = useQuery({
    queryKey: ["list", listId],
    queryFn: () =>
      axios.get<List>(`/list/${listId}`).then(({ data }) => data),
    refetchInterval: 5000,
  }).data;
  const router = useRouter();
  const listQuery = useQuery({
    queryKey: ["items", listId],
    enabled: listId !== undefined,
    queryFn: () =>
      axios.get<Item[]>(`/list/${listId}/items`).then(({ data }) => data),
    refetchInterval: 1000,
  });

  const deleteList = useMutation({
    mutationFn: () => axios.delete<List>(`/list/${listId}`),
    onSuccess: () => {
      setModal((modal) => ({
        ...modal,
        open: true,
        title: `Deleted`,
        description: `Successfully deleted list ${data && data.title}`,
        type: "confirm",
        options: [
          {
            label: "Great!",
            functions: [closeModal, () => router.back()],
          },
        ],
        close: closeModal,
      }));
    },
    onError: () => {
      setModal((modal) => ({
        ...modal,
        open: true,
        title: `Error`,
        description: "Something went wrong. Please try again later.",
        type: "alert",
        options: [
          {
            label: "Okay",
            functions: [closeModal],
          },
        ],
        close: closeModal,
      }));
    },
  });

  const deleteNewItem = (id: number) => {
    setCreateItem((prev) => prev.filter((item) => item !== id));
  };

  const closeModal = () => setModal((modal) => ({ ...modal, open: false }));

  return (
    data &&
    listQuery.data && (
      <div
        style={{
          background:
            "linear-gradient(124.65deg, #6268FF 16.66%, #8E05E8 47.24%, #FF00D6 93.31%)",
        }}
        className="w-[100vw] h-[100vh] flex flex-col items-center justify-center]"
      >
        <div className="w-full max-w-md p-2 my-2 mx-8 overflow-y-auto">
          <div className="w-full rounded-2xl bg-white p-2 my-2 overflow-y-auto">
            <div className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-md font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <div className="flex gap-4">
                <button onClick={() => router.back()}>
                  <ArrowLeftIcon className="h-5 w-5 text-purple-900" />
                </button>
                <span>{data.title}</span>
              </div>
              <button
                onClick={() => {
                  setModal((modal) => ({
                    ...modal,
                    open: true,
                    title: `Are you sure you want to delete ${data.title} list?`,
                    description: "This action cannot be undone.",
                    type: "alert",
                    options: [
                      {
                        label: "Yes, please",
                        functions: [closeModal, () => deleteList.mutate()],
                      },
                      {
                        label: "No, thanks",
                        functions: [closeModal],
                      },
                    ],
                    close: closeModal,
                  }));
                }}
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <div className="flex gap-4 border-b-2 border-b-slate-400 m-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Some key phrase"
                onChange={(e) => setSearch(e.target.value)}
                className="focus:outline-0 w-full text-xs bg-inherit font-normal leading-4"
              />
            </div>
            <div className="grid grid-cols-3 py-3">
              <button
                className={
                  filter === "all"
                    ? "border-solid border-2 border-black font-normal text-md rounded-lg px-2 bg-slate-200"
                    : "font-normal text-md px-2"
                }
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={
                  filter === "active"
                    ? "border-solid border-2 border-black font-normal text-md rounded-lg px-2 bg-slate-200"
                    : "font-normal text-md px-2"
                }
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={
                  filter === "completed"
                    ? "border-solid border-2 border-black font-normal text-md rounded-lg px-2 bg-slate-200"
                    : "font-normal text-md px-2"
                }
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
            <ul>
              {listQuery.data &&
                listQuery.data.map((item) => {
                  return (
                    (item.title.includes(search) ||
                      item.text.includes(search)) &&
                    //Select all
                    (filter === "all" ||
                      //Select active
                      (filter === "active" &&
                        new Date(item.deadline).getUTCDate() -
                          new Date().getUTCDate() +
                          (new Date(item.deadline).getUTCMonth() -
                            new Date().getUTCMonth()) *
                            60 >
                          0) ||
                      //Select completed
                      (filter === "completed" && item.completed === true)) && (
                      <ItemComponent list={data} item={item} />
                    )
                  );
                })}
            </ul>
            <ul>
              {createItem.map((item) => {
                return (
                  <CreateItem
                    key={item}
                    id={item}
                    listId={Number(listId)}
                    deleteNewItem={deleteNewItem}
                  />
                );
              })}
            </ul>
            <div className="relative rounded-md p-3 mt-3 bg-gray-100 hover:bg-gray-300 text-slate-300 hover:text-white">
              <button
                className="w-full text-center"
                onClick={() =>
                  setCreateItem(
                    createItem.length === 0
                      ? [createItem.length + 1]
                      : [...createItem, createItem.length + 1]
                  )
                }
              >
                Add new item
              </button>
            </div>
          </div>
        </div>
        <ModalComponent modal={modal} />
      </div>
    )
  );
};

export default DetailPage;