/**
 * declare common models here
 */
export interface NoteDetails {
  title: string;
  content: string;
  noteId: string;
  tags: string[];
}

export interface SelectedNoteIdObj {
  noteId: string;
}
