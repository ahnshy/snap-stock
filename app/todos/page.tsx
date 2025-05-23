import { title } from "@/components/primitives";
import TodosLayout from "@/app/todos/layout";
import TodosTable from "@/components/todos-table"
import { fetchTodos } from "@/data/firestore";
import { Todo } from "@/types";

async function getInitialList() {
  console.log("getInitialList called.");
  //await new Promise(f => setTimeout(f, 3000)); // 3초 대기 후 10 리턴
  //const response = await fetchTodos();
  //console.log(`${process.env.BASE_API_URL}/todos`);
  //alert(`${process.env.BASE_API_URL}/todos`);
  const response = await fetch(`${process.env.BASE_API_URL}/todos`,
    { cache: 'no-store'})

  if (!response.ok){
    throw new Error('Failed to fetch data')
  }

  const contentHeader = response.headers.get("content-type");
  if (contentHeader?.includes("text/html")) {
    return null;
  }

  return response.json();
}

export default async function EntryPage() {

  const res = await getInitialList();

  const fetched = res?.data?? [];

  return (
    <div className="flex flex-col space-y-8">
      <h1 className={title()}>증시 현황</h1>
      <TodosTable todos={ fetched } />
    </div>
  );
}

