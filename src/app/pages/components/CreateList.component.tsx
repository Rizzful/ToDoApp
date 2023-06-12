import { ListValidation, listValidationSchema } from "@/app/types/Form";
import React from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { List } from "@/app/types/List";
import axios from "@/app/api/requests/axios";
import getQueryClient from "@/app/utils/getQueryClient";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { ModalConfig } from "@/app/types/Modal";
import ModalComponent from "./Modal.component";

const CreateList = ({
  deleteNewList,
  id,
}: {
  deleteNewList: (id: number) => void;
  id: number;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListValidation>({
    resolver: zodResolver(listValidationSchema),
    defaultValues: {
      createdAt: new Date(),
      title: "",
    },
  });

  const [modal, setModal] = React.useState<ModalConfig>();
  const closeModal = () => setModal(undefined);

  const onSubmit: SubmitHandler<ListValidation> = (data) => {
    createList.mutate(data as unknown as List);
  };

  const onError: SubmitErrorHandler<ListValidation> = (errors) => {
    console.log(errors);
  };

  const createList = useMutation({
    mutationFn: (list: List) => axios.post<List>(`/list`, list),
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
                .invalidateQueries(["list"])
                .then(() => {
                  deleteNewList(id);
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
    <div className="w-full rounded-lg bg-purple-100 px-4 py-2 text-center text-md font-semibold text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
      <div className="flex justify-between">
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex gap-4">
          <button type="submit">
            <CheckIcon
              className="h-5 w-5 text-blue-500"
            />
          </button>
          <div>
            <input
              type="text"
              placeholder="Title"
              {...register("title")}
              className="bg-inherit focus:outline-0 border-b-2 border-b-slate-400 focus:border-black"
            />
            <p>{errors.title && errors.title.message}</p>
          </div>
        </form>
        <button
          onClick={() => {
            deleteNewList(id);
          }}
        >
          <TrashIcon
            className="h-5 w-5 text-red-500"
          />
        </button>
      </div>
      {modal && <ModalComponent modal={modal} />}
    </div>
  );
};

export default CreateList;
