"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import { VerticalDotsIcon } from "./icons";
import CustomModal from "./custom-modal";

import { CustomModalType, FocusedTodoType, Todo } from "@/types";

import "react-toastify/dist/ReactToastify.css";

const TodosTable = ({ todos }: { todos: Todo[] }) => {
  const { data: session, status } = useSession();
  const [todoAddEnable, setTodoAddEnable] = useState(false);
  const [newTodoInput, setNewTodoInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
    focusedTodo: null,
    modalType: "detail",
  });

  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  const addTodoHandler = async (title: string) => {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }
    if (!todoAddEnable) return;

    setTodoAddEnable(false);
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        //uid: session!.user!.uid,  // 로그인된 사용자의 uid 함께 전송
        uid: session.user.uid,
      }),
      cache: "no-store",
    });

    setNewTodoInput("");
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("Succeed to add todo");
  };

  const editTodoHandler = async (
      id: string,
      modifiedTitle: string,
      modifiedIsDone: boolean
  ) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/todos/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: modifiedTitle,
        is_done: modifiedIsDone,
      }),
      cache: "no-store",
    });

    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("Succeed to modify todo");
  };

  const deleteTodoHandler = async (id: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/todos/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("Succeed to delete todo");
  };

  const applyIsDoneCSS = (isDone: boolean) =>
      isDone ? "line-through text-gray-500" : "";

  const TodoRow = (item: Todo) => (
      <TableRow key={item.id}>
        <TableCell className={applyIsDoneCSS(item.is_done)}>
          {item.id.slice(0, 4)}
        </TableCell>
        <TableCell className={applyIsDoneCSS(item.is_done)}>
          {item.title}
        </TableCell>
        <TableCell className={applyIsDoneCSS(item.is_done)}>
          {item.is_done ? "Done" : "Progress"}
        </TableCell>
        <TableCell className={applyIsDoneCSS(item.is_done)}>
          {item.create_at}
        </TableCell>
        <TableCell>
          <div className="flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                  onAction={(key) => {
                    setCurrentModalData({
                      focusedTodo: item,
                      modalType: key as CustomModalType,
                    });
                    onOpen();
                  }}
              >
                <DropdownItem key="detail">View</DropdownItem>
                <DropdownItem key="modify">Modify</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </TableCell>
      </TableRow>
  );

  return (
      <div className="flex flex-col space-y-4">
        {/* Modal */}
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) =>
                currentModalData.focusedTodo && (
                    <CustomModal
                        focusedTodo={currentModalData.focusedTodo}
                        modalType={currentModalData.modalType}
                        onClose={onClose}
                        onDelete={async (id) => {
                          await deleteTodoHandler(id);
                          onClose();
                        }}
                        onEdit={async (id, title, isDone) => {
                          await editTodoHandler(id, title, isDone);
                          onClose();
                        }}
                    />
                )
            }
          </ModalContent>
        </Modal>

        {/* Toast */}
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
        />

        {/* Input & Add Button: 로그인된 경우에만 표시 */}
        {status === "authenticated" && (
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                  label="검색 할 증시 키워드를 입력하세요."
                  placeholder="Enter stock search keywords"
                  value={newTodoInput}
                  onValueChange={(val) => {
                    setNewTodoInput(val);
                    setTodoAddEnable(val.length > 0);
                  }}
              />
              <Button
                  className="h-14"
                  color="warning"
                  onPress={() => addTodoHandler(newTodoInput)}
                  disabled={!todoAddEnable}
              >
                Enter
              </Button>
              {isLoading && <Spinner size="sm" color="warning" />}
            </div>
        )}

        {/* Todo Table */}
        <Table aria-label="Todo List">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TODO</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="There are no items to show.">
            {todos.map(TodoRow)}
          </TableBody>
        </Table>
      </div>
  );
};

export default TodosTable;
