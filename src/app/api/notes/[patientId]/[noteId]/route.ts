import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { notesStore } from "@/lib/notes-store";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ patientId: string; noteId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patientId, noteId } = await params;
  const note = notesStore.togglePin(patientId, noteId);

  if (!note) {
    return NextResponse.json(
      { success: false, error: "Note not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: note });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ patientId: string; noteId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patientId, noteId } = await params;
  const deleted = notesStore.delete(patientId, noteId);

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Note not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
