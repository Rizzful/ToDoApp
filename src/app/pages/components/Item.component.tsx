import axios from "@/app/api/requests/axios";
import { Item } from "@/app/types/Item";
import { List } from "@/app/types/List";
import { ModalConfig } from "@/app/types/Modal";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import ModalComponent from "./Modal.component";

const ItemComponent = ({ list, item }: { list: List; item: Item }) => {
  const [modal, setModal] = React.useState<ModalConfig>({
    open: false,
    type: "confirm",
    title: "",
    description: "",
    options: [],
    close: () => {},
  });
  const closeModal = () => setModal((modal) => ({ ...modal, open: false }));

  const updateItem = useMutation({
    mutationFn: (item: Item) =>
      axios.put<Item>(`/list/${list.id}/items/${item.id}`, item),
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

  const deleteItem = useMutation({
    mutationFn: (item: Item) =>
      axios.delete<Item>(`/list/${list.id}/items/${item.id}`),
    onSuccess: () => {
      setModal((modal) => ({
        ...modal,
        open: true,
        title: `Deleted`,
        description: `Successfully deleted item`,
        type: "confirm",
        options: [
          {
            label: "Great!",
            functions: [closeModal],
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

  return (
    <div>
      <li className="relative rounded-md p-3 hover:bg-gray-100" key={item.id}>
        <div className="flex">
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
              <CheckIcon className="h-5 w-5 text-green-500 border-2 border-black rounded-md" />
            ) : (
              <XMarkIcon className="h-5 w-5 text-red-500 border-2 border-black rounded-md" />
            )}
          </button>
          <div>
            <h3 className="px-8 text-sm font-semibold leading-5">
              {item.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <p className="font-light text-xs">
              {new Date(item.deadline).getUTCDate() -
                new Date().getUTCDate() +
                (new Date(item.deadline).getUTCMonth() -
                  new Date().getUTCMonth()) *
                  60}{" "}
              Days left
            </p>
          </div>
        </div>
        <div className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
          {item.text}
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={() => {
              setModal((modal) => ({
                ...modal,
                open: true,
                title: `Are you sure you want to delete ${item.title} item?`,
                description: "This action cannot be undone.",
                type: "alert",
                options: [
                  {
                    label: "Yes, please",
                    functions: [closeModal, () => deleteItem.mutate(item)],
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
      </li>
      <ModalComponent modal={modal} />
    </div>
  );
};

export default ItemComponent;
