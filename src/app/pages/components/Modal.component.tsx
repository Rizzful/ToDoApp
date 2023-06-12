import { ModalConfig } from "@/app/types/Modal";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ModalComponent = ({ modal }: { modal: ModalConfig }) => {
  return (
    modal && (
      <div>
        <Transition appear show={modal.open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={modal.close}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {modal.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {modal.description}
                      </p>
                    </div>

                    <div className="mt-4">
                      {modal.options.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`inline-flex justify-center rounded-md border border-transparent mr-4 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                            modal.type === "alert"
                              ? "bg-red-100 text-red-900 hover:bg-red-200 focus-visible:ring-red-500 "
                              : "bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 "
                          }`}
                          onClick={() => option.functions.map((func) => func())}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    )
  );
};

export default ModalComponent;
