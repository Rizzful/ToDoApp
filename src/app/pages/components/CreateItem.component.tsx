import { ItemValidation, itemValidationSchema } from "@/app/types/Form";
import React from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Item } from "@/app/types/Item";
import axios from "@/app/api/requests/axios";
import getQueryClient from "@/app/utils/getQueryClient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ModalConfig } from "@/app/types/Modal";
import ModalComponent from "./Modal.component";

const CreateItem = ({
  deleteNewItem,
  id,
  listId,
}: {
  deleteNewItem: (id: number) => void;
  id: number;
  listId: number;
}) => {
  const [modal, setModal] = React.useState<ModalConfig>();
  const closeModal = () => setModal(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemValidation>({
    resolver: zodResolver(itemValidationSchema),
    defaultValues: {
      completed: false,
      start: new Date(),
      deadline: new Date(),
      text: "",
      title: "",
    },
  });

  const onSubmit: SubmitHandler<ItemValidation> = (data) => {
    createItem.mutate(data as Item);
  };

  const onError: SubmitErrorHandler<ItemValidation> = (errors) => {
    console.log(errors);
  };
  const createItem = useMutation({
    mutationFn: (item: Item) => axios.post<Item>(`/list/${listId}/items`, item),
    onSuccess: () => {
      setModal((modal) => ({
        ...modal,
        open: true,
        title: `Created`,
        description: `Successfully created list`,
        type: "confirm",
        options: [
          {
            label: "Great!",
            functions: [
              closeModal,
              () =>
                getQueryClient()
                  .invalidateQueries(["items"])
                  .then(() => {
                    deleteNewItem(id);
                  }),
            ],
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
    <div className="relative rounded-md p-3 hover:bg-gray-100">
      <div className="flex">
        <form className="w-full" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex gap-4 pb-4">
            <div className="text-sm font-semibold leading-5 w-1/2">
              <input
                type="text"
                placeholder="New item title"
                {...register("title")}
                className="focus:outline-0 border-b-2 w-full text-xs bg-inherit font-normal leading-4 border-b-slate-400 focus:border-black"
              />
              <p>{errors.title && errors.title.message}</p>
            </div>
            <div className="font-light text-xs w-1/2">
              <input
                className="focus:outline-0 border-b-2 w-full bg-inherit border-b-slate-400 focus:border-black"
                type="date"
                {...register("deadline")}
              />
              <p>{errors.deadline && errors.deadline.message}</p>
            </div>
          </div>
          <div className="w-full mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500 content-stretch">
            <textarea
              className="w-full break-after-all h-8 max-h-24 focus:outline-0 border-b-2 bg-inherit border-b-slate-400 focus:border-black resize-y"
              placeholder="Item description"
              {...register("text")}
            />
            <p>{errors.text && errors.text.message}</p>
          </div>
          <div className="flow-root my-4">
            <button
              type="submit"
              className="bg-blue-700 rounded-xl text-white px-4 py-2 flex gap-2 float-left text-xs font-normal leading-4"
            >
              Submit
            </button>
            <button
              className="float-right py-2"
              onClick={() => {
                deleteNewItem(id);
              }}
            >
              <XMarkIcon className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </form>
      </div>
      {modal && <ModalComponent modal={modal} />}
    </div>
  );
};

export default CreateItem;
