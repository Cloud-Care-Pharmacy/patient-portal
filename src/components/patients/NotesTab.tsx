"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Pin, PinOff, Trash2, StickyNote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  usePatientNotes,
  useCreateNote,
  useTogglePin,
  useDeleteNote,
} from "@/lib/hooks/use-notes";
import type { PatientNote, NoteCategory } from "@/types";

// ---- Schema ----

const noteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
  category: z.string().min(1, "Category is required"),
});

type NoteFormData = z.infer<typeof noteSchema>;

// ---- Constants ----

const CATEGORY_LABELS: Record<NoteCategory, string> = {
  clinical: "Clinical Observation",
  pharmacy: "Pharmacy Note",
  "follow-up": "Follow-up",
  general: "General",
};

const CATEGORY_COLORS: Record<NoteCategory, string> = {
  clinical: "bg-blue-100 text-blue-800",
  pharmacy: "bg-green-100 text-green-800",
  "follow-up": "bg-amber-100 text-amber-800",
  general: "bg-gray-100 text-gray-800",
};

// ---- AddNoteSheet ----

function AddNoteSheet({
  patientId,
  open,
  onOpenChange,
}: {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createNote = useCreateNote(patientId);
  const form = useForm<NoteFormData>({
    defaultValues: { content: "", category: "general" },
  });
  const categoryValue = useWatch({ control: form.control, name: "category" });

  function onSubmit(data: NoteFormData) {
    const result = noteSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof NoteFormData;
        form.setError(field, { message: issue.message });
      }
      return;
    }

    createNote.mutate(
      {
        content: result.data.content,
        category: result.data.category as NoteCategory,
        authorName: "Staff Member",
        authorRole: "staff",
      },
      {
        onSuccess: () => {
          toast.success("Note added");
          form.reset();
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Add Note</SheetTitle>
          <SheetDescription>
            Add a clinical or general note for this patient.
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 p-4"
        >
          <div className="space-y-2">
            <Label htmlFor="note-category">Category</Label>
            <Select
              value={categoryValue}
              onValueChange={(v) => {
                if (v) form.setValue("category", v);
              }}
            >
              <SelectTrigger id="note-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="clinical">Clinical Observation</SelectItem>
                <SelectItem value="pharmacy">Pharmacy Note</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="note-content">Note</Label>
            <Textarea
              id="note-content"
              placeholder="Write your note here…"
              className="min-h-[160px] resize-none"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createNote.isPending}>
              {createNote.isPending ? "Saving…" : "Add Note"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ---- NoteCard ----

function NoteCard({
  note,
  onTogglePin,
  onDelete,
  isPinning,
  isDeleting,
}: {
  note: PatientNote;
  onTogglePin: () => void;
  onDelete: () => void;
  isPinning: boolean;
  isDeleting: boolean;
}) {
  return (
    <Card className={note.isPinned ? "border-amber-300 bg-amber-50/50" : undefined}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Meta row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{note.authorName}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {note.authorRole}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[note.category]}`}
              >
                {CATEGORY_LABELS[note.category]}
              </Badge>
              {note.isPinned && <Pin className="h-3 w-3 text-amber-600" />}
            </div>

            {/* Content */}
            <p className="text-sm whitespace-pre-wrap">{note.content}</p>

            {/* Timestamp */}
            <p className="text-xs text-muted-foreground">
              {new Date(note.createdAt).toLocaleString("en-AU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Right: actions */}
          <div className="flex flex-col gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onTogglePin}
              disabled={isPinning}
              title={note.isPinned ? "Unpin note" : "Pin note"}
            >
              {note.isPinned ? (
                <PinOff className="h-3.5 w-3.5" />
              ) : (
                <Pin className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-500 hover:text-red-700"
              onClick={onDelete}
              disabled={isDeleting}
              title="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- NotesTab (main export) ----

export function NotesTab({ patientId }: { patientId: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data, isLoading, error } = usePatientNotes(patientId);
  const togglePin = useTogglePin(patientId);
  const deleteNoteMutation = useDeleteNote(patientId);

  function handleTogglePin(noteId: string) {
    togglePin.mutate(noteId, {
      onError: (err) => toast.error(err.message),
    });
  }

  function handleDelete(noteId: string) {
    deleteNoteMutation.mutate(noteId, {
      onSuccess: () => toast.success("Note deleted"),
      onError: (err) => toast.error(err.message),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">Failed to load notes: {error.message}</div>
    );
  }

  const notes = data?.data?.notes ?? [];
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setSheetOpen(true)}
      >
        <StickyNote className="mr-2 h-4 w-4" />
        Add a note…
      </Button>

      <AddNoteSheet
        patientId={patientId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      {notes.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="h-12 w-12" />}
          title="No notes yet"
          description="Add your first note above to start documenting patient interactions."
        />
      ) : (
        <div className="space-y-3">
          {/* Pinned section */}
          {pinnedNotes.length > 0 && (
            <>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Pinned
              </p>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() => handleTogglePin(note.id)}
                  onDelete={() => handleDelete(note.id)}
                  isPinning={togglePin.isPending && togglePin.variables === note.id}
                  isDeleting={
                    deleteNoteMutation.isPending &&
                    deleteNoteMutation.variables === note.id
                  }
                />
              ))}
              {unpinnedNotes.length > 0 && (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">
                  All Notes
                </p>
              )}
            </>
          )}

          {/* Chronological section */}
          {unpinnedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTogglePin={() => handleTogglePin(note.id)}
              onDelete={() => handleDelete(note.id)}
              isPinning={togglePin.isPending && togglePin.variables === note.id}
              isDeleting={
                deleteNoteMutation.isPending && deleteNoteMutation.variables === note.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
