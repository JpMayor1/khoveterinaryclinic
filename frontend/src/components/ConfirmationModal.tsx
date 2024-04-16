import { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";

const ConfirmationModal = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
}: {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={onCancel}
                initialFocus={cancelButtonRef}
            >
                <div className="flex items-center justify-center min-h-screen">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-dark opacity-30" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="relative bg-light rounded-lg p-4 shadow-xl transform transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium text-dark"
                                >
                                    Confirmation
                                </Dialog.Title>
                                <button
                                    className="text-dark hover:text-dark/70"
                                    onClick={onCancel}
                                    ref={cancelButtonRef}
                                >
                                    <IoClose className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="text-dark/70">{message}</div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    className={`${
                                        message.includes("unblock")
                                            ? "bg-light-green hover:bg-light-green/70"
                                            : "bg-red hover:bg-red/70"
                                    } text-light py-2 px-4 rounded-md mr-2`}
                                    onClick={onConfirm}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-dark/70 py-2 px-4 rounded-md"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ConfirmationModal;
