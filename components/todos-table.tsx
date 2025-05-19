"use client";

import React, { useState, useEffect } from "react";
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
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import { VerticalDotsIcon } from "./icons";
import CustomModal from "./custom-modal";
import { CustomModalType, FocusedTodoType, Todo } from "@/types";

import "react-toastify/dist/ReactToastify.css";

interface Suggestion {
  code: string;
  name: string;
  price?: number;
}

const TodosTable = ({ todos }: { todos: Todo[] }) => {
  const { data: session, status } = useSession();
  const [todoAddEnable, setTodoAddEnable] = useState(false);
  const [newTodoInput, setNewTodoInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
    focusedTodo: null,
    modalType: "detail",
  });

  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const notifySuccessEvent = (msg: string) => toast.success(msg);

  useEffect(() => {
    if (!newTodoInput) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSuggestLoading(true);
      try {
        const res = await fetch(
            `/api/stocks?q=${encodeURIComponent(newTodoInput)}`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      } finally {
        setIsSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [newTodoInput]);

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
      body: JSON.stringify({ title, uid: session!.user!.email }),
      cache: "no-store",
    });

    setNewTodoInput("");
    setSuggestions([]);
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("Successfully added todo");
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
    notifySuccessEvent("Successfully modified todo");
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
    notifySuccessEvent("Successfully deleted todo");
  };

  const applyIsDoneCSS = (isDone: boolean) =>
      isDone ? "line-through text-gray-500" : "";

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
            hideProgressBar
            theme="dark"
        />

        {/* Input & Suggestions */}
        {status === "authenticated" && (
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <div className="relative flex-1">
                <Input
                    label="검색 할 증시 키워드를 입력하세요."
                    placeholder="Enter stock search keywords"
                    value={newTodoInput}
                    onValueChange={(val) => {
                      setNewTodoInput(val);
                      setTodoAddEnable(val.length > 0);
                    }}
                    fullWidth
                />
                {isSuggestLoading && (
                    <Spinner
                        size="sm"
                        color="warning"
                        className="absolute right-4 top-4"
                    />
                )}
                {suggestions.length > 0 && (
                    <ul
                        className="
                  absolute z-10 mt-1 w-full max-h-60 overflow-y-auto
                  rounded-lg bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  shadow-lg
                  divide-y divide-gray-100 dark:divide-gray-700
                "
                    >
                      {suggestions.map((s) => (
                          <li
                              key={s.code}
                              onClick={() => {
                                setNewTodoInput(s.name);
                                setTodoAddEnable(true);
                                setSuggestions([]);
                              }}
                              className="
                      flex justify-between items-center px-4 py-2
                      cursor-pointer
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-150
                    "
                          >
                    <span className="font-medium text-base text-gray-900 dark:text-gray-100">
                      {s.name} ({s.code})
                    </span>
                            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      {s.price != null
                          ? `${s.price.toLocaleString()}원`
                          : "가격 정보 없음"}
                    </span>
                          </li>
                      ))}
                    </ul>
                )}
              </div>
              <Button
                  className="h-14"
                  color="warning"
                  onPress={() => addTodoHandler(newTodoInput)}
                  disabled={!todoAddEnable}
              >
                등록
              </Button>
              {isLoading && <Spinner size="sm" color="warning" />}
            </div>
        )}

        {/* Todo Table */}
        <Table aria-label="Todo List">
          <TableHeader>
            <TableColumn>종목코드</TableColumn>
            <TableColumn>종목명</TableColumn>
            <TableColumn>시세</TableColumn>
            <TableColumn>등록일</TableColumn>
            <TableColumn>메뉴</TableColumn>
          </TableHeader>
          <TableBody emptyContent="There are no items to show.">
            {todos.map((item) => (
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
                    {new Date(item.create_at).toLocaleString()}
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
            ))}
          </TableBody>
        </Table>
      </div>
  );
};

export default TodosTable;
