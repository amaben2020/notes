import { Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import EditNote from "./EditNote";
import NewNote from "./NewNote";
import Note from "./Note";
import NoteLayout from "./NoteLayout";
import NoteList from "./NoteList";
import { useLocalStorage } from "./useLocalStorage";

export type RawNote = {
  id: string;
} & RawNoteData;

export type Note = {
  id: string;
} & NoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  // useLocalStorage for persistent state

  const [notes, setNotes] = useLocalStorage<RawNote[]>("notes", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [tags, notes]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag: Tag) {
    setTags((p) => [...p, tag]);
  }

  function deleteNote(id: string) {
    setNotes((p) => p.filter((e) => e.id !== id));
  }

  function updateTag(id: string, label: string) {
    setTags((previousTag) => {
      return previousTag.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }
  function deleteTag(id: any) {
    setTags((p) => p.filter((e) => e.id !== id));
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  console.log("Notes,", notes);
  console.log("Tags,", tags);
  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdate={updateTag}
              onDelete={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={deleteNote} />} />
          <Route
            index
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
