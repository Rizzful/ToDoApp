import axios from "@/app/api/requests/axios";
import { Item } from "@/app/types/Item";
import { useMutation, useQuery } from "@tanstack/react-query";
import { List } from "@/app/types/List";
import React from "react";
import { useRouter } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ListComponent = ({ list }: { list: List }) => {
  const [filter, setFilter] = React.useState("all");
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();
  const listQuery = useQuery({
    queryKey: ["items", list.id],
    enabled: list.id !== undefined && collapsed,
    queryFn: () =>
      axios.get<Item[]>(`/list/${list.id}/items`).then(({ data }) => data),
    refetchInterval: 1000,
  });

  const updateItem = useMutation({
    mutationFn: (item: Item) =>
      axios.put<Item>(`/list/${list.id}/items/${item.id}`, item),
  });

  return (
    <Disclosure>
      {({ open }) => {
        return (
          <>
            <Disclosure.Button
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            >
              <span>{list.title}</span>
              <ChevronUpIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-purple-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="bg-white rounded-b-2xl">
              <div>
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
                        //Select all
                        (filter === "all" ||
                          //Select active
                          (filter === "active" &&
                            new Date(item.deadline) > new Date()) ||
                          //Select completed
                          (filter === "completed" &&
                            item.completed === true)) && (
                          <li
                            className="relative rounded-md p-3 hover:bg-gray-100"
                            key={item.id}
                          >
                            <div className="grid grid-cols-3 lg:gap-8 md:gap-8 sm:gap-4 xs:gap-4 gap-4">
                              <button
                                onClick={() => {
                                  updateItem.mutate({
                                    ...item,
                                    completed: !item.completed,
                                  });
                                }}
                                className="font-medium lg:text-md md:text-md sm:text-sm xs:text-xs text-xs"
                              >
                                {item.completed ? (
                                  <CheckIcon
                                    className={`h-5 w-5 text-green-500 border-black rounded-md`}
                                  />
                                ) : (
                                  <XMarkIcon
                                    className={`h-5 w-5 text-red-500 border-black rounded-md`}
                                  />
                                )}
                              </button>
                              <div>
                                <h3 className="text-sm font-medium leading-5">
                                  {item.title}
                                </h3>
                              </div>
                              <div className="flex gap-2">
                                <p className="font-medium lg:text-md md:text-md sm:text-sm xs:text-xs text-xs">
                                  Due to
                                </p>
                                <p className="font-light lg:text-md md:text-md sm:text-sm xs:text-xs text-xs">
                                  {new Date(item.deadline).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </li>
                        )
                      );
                    })}
                </ul>
                <div>
                  <div className="flex justify-center px-8 pt-2 pb-4">
                    <button
                      className="bg-purple-900 drop-shadow-[6px_10px_6px_rgba(0,0,0,0.25)] text-purple-100 rounded-2xl h-8 px-16"
                      onClick={() => {
                        router.push(`pages/detail/${list.id}`);
                      }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        );
      }}
    </Disclosure>
  );
};

export default ListComponent;
