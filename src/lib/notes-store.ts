import type { PatientNote } from "@/types";

/**
 * In-memory notes store — temporary mock backend.
 * Replace with real DB calls when prescription-gateway adds notes endpoints.
 */
class NotesStore {
  private notes: Map<string, PatientNote[]> = new Map();

  getByPatient(patientId: string): PatientNote[] {
    const list = this.notes.get(patientId) ?? [];
    // Pinned first, then newest first
    return [...list].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  add(note: PatientNote): void {
    const list = this.notes.get(note.patientId) ?? [];
    list.push(note);
    this.notes.set(note.patientId, list);
  }

  find(patientId: string, noteId: string): PatientNote | undefined {
    return this.notes.get(patientId)?.find((n) => n.id === noteId);
  }

  togglePin(patientId: string, noteId: string): PatientNote | undefined {
    const note = this.find(patientId, noteId);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString();
    }
    return note;
  }

  delete(patientId: string, noteId: string): boolean {
    const list = this.notes.get(patientId);
    if (!list) return false;
    const idx = list.findIndex((n) => n.id === noteId);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  }
}

// Singleton — survives across requests in the same Node process
export const notesStore = new NotesStore();
