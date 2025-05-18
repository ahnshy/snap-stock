import { NextRequest, NextResponse } from "next/server";
import { getTodo, deleteTodo, updateTodo } from "@/data/firestore";

type SlugParams = { slug: string };

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<SlugParams> }
): Promise<NextResponse> {
  const { slug } = await params;
  if (!slug) {
    return new NextResponse(null, { status: 400 });
  }

  const todo = await getTodo(slug);
  if (!todo) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(
      { message: "get single item by id succeed!", data: todo },
      { status: 200 }
  );
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<SlugParams> }
): Promise<NextResponse> {
  const { slug } = await params;

  const deleted = await deleteTodo(slug);
  if (!deleted) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(
      { message: "delete single item by id succeed!" },
      { status: 200 }
  );
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<SlugParams> }
): Promise<NextResponse> {
  const { slug } = await params;
  const { title, is_done } = await request.json();

  const updated = await updateTodo(slug, { title, is_done });
  if (!updated) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(
      { message: "modify single item by id succeed!", data: updated },
      { status: 200 }
  );
}
