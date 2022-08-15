/*
 * @Author: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Date: 2022-08-14 16:18:20
 * @Last Modified by: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Last Modified time: 2022-08-15 14:18:20
 * @description: list for show post live client details
 */

import React, { useEffect, useState } from 'react';

import NotesDetails from '../../components/notes-details/notes-details';
import NotesList from '../../components/notes-list/notes-list';
import TagList from '../../components/tag-list/tag-list';

import { NoteDetails, SelectedNoteIdObj } from '../../types/global-model';
import { HYKE_NOTES_TEXT, NEW_NOTE_TEXT } from '../../utils/global-constans';

import './dashboard.scss';

const Dashboard: React.FC = () => {
  const [selectedNotes, setSelectedNoteInfo] = useState({} as NoteDetails);
  const [notesList, setNotesList] = useState([] as NoteDetails[]);
  const [selectedTags, setSelectedTags] = useState([] as string[]);
  const [tagsList, setTagsList] = useState([] as string[]);
  const [selectedTag, setTagSelection] = useState('');
  const [filteredNotesList, setFilteredNotesList] = useState(
    [] as NoteDetails[]
  );
  const [selectedNoteId, setNoteIdSelection] = useState(
    {} as SelectedNoteIdObj
  );
  useEffect(() => {
    const LOCAL_NOTES_LIST: NoteDetails[] = localStorage.getItem(
      HYKE_NOTES_TEXT
    )
      ? JSON.parse(localStorage.getItem(HYKE_NOTES_TEXT) || '{}')
      : ([] as NoteDetails[]);
    setNotesList(LOCAL_NOTES_LIST);
    setSelectedNoteInfo(LOCAL_NOTES_LIST[0]);
    setSelectedTags(LOCAL_NOTES_LIST[0]?.tags);
    setFilteredNotesList(LOCAL_NOTES_LIST);
  }, []);

  useEffect(() => {
    if (notesList.length) generateTagsList();
  }, [notesList]);

  /**
   * @name handleNotesSelection
   * @param selectedNote<NoteDetails>
   * @returns none
   * @desc used to update the note details on the right side
   */
  const handleNotesSelection = (selectedNote: NoteDetails): void => {
    setSelectedNoteInfo(selectedNote);
    selectedNote?.tags
      ? setSelectedTags([...selectedNote?.tags])
      : setSelectedTags([]);
  };

  /**
   * @name addNewNote
   * @param none
   * @returns none
   * @desc used to add new note to the list
   */
  const addNewNote = (): void => {
    if (!checkForExistingNewNotes()) {
      const UUID =
        Date.now().toString(36) + Math.random().toString(36).substring(2); // generate Unique ID
      // add note to original notes list which used for future reference
      setNotesList((old) => [
        ...[
          {
            noteId: UUID,
            title: 'New note...',
            content: '',
            tags: [],
          } as NoteDetails,
        ],
        ...old,
      ]);
      // add note to filter object which is for rendering
      setFilteredNotesList((old) => [
        ...[
          {
            noteId: UUID,
            title: 'New note...',
            content: '',
            tags: [],
          } as NoteDetails,
        ],
        ...old,
      ]);
      setNoteIdSelection({ noteId: UUID });
    }
  };

  /**
   * @name deleteNote
   * @param none
   * @returns none
   * @desc used to delete note from the list
   */
  const deleteNote = (): void => {
    let updatedOriginalNotesList = [...notesList];
    let updatedFilteredNotesList = [...filteredNotesList];
    updatedOriginalNotesList.map((eachNote, index) => {
      if (eachNote.noteId === selectedNotes.noteId) {
        updatedOriginalNotesList.splice(index, 1);
      }
    });
    updatedFilteredNotesList.map((eachNote, index) => {
      if (eachNote.noteId === selectedNotes.noteId) {
        updatedFilteredNotesList.splice(index, 1);
      }
    });
    setNotesList([...updatedOriginalNotesList]);
    setFilteredNotesList([...updatedFilteredNotesList]);
    setNoteIdSelection({
      ...selectedNoteId,
      ...{ noteId: notesList[0]?.noteId },
    }); // set the first record as selected
    saveNotesInLocalStorage(selectedNotes.noteId); // save data after deleting note record
    generateTagsList(); // update tags list in left nav
  };

  /**
   * @name checkForExistingNewNotes
   * @param none
   * @returns boolean<true|false>
   * @desc used to check the duplicate record in the list and return boolean
   */
  const checkForExistingNewNotes = (): boolean => {
    return filteredNotesList.some(
      (noteItem) => !noteItem.title || noteItem.title === NEW_NOTE_TEXT
    );
  };

  /**
   * @name handleDeleteTag
   * @param deletedTagId<string>
   * @returns void
   * @desc used to delete the selected tag and update the list
   */
  const handleDeleteTag = (deletedTagId: string): void => {
    const updatedSelectedNote = selectedNotes;
    updatedSelectedNote.tags?.splice(
      updatedSelectedNote?.tags?.indexOf(deletedTagId),
      1
    );
    tagsList?.splice(tagsList?.indexOf(deletedTagId), 1);
    setTagsList([...tagsList]);
    setSelectedNoteInfo(updatedSelectedNote);
    setSelectedTags([...updatedSelectedNote.tags]);
    saveNotesInLocalStorage(); // save data after deleting tag in each record
  };

  /**
   * @name updateSelectedNotes
   * @param updatedNoteDetails<NoteDetails>
   * @returns void
   * @desc used to update the title and conent updated in note details
   */
  const updateSelectedNotes = (updatedNoteDetails: NoteDetails): void => {
    setSelectedNoteInfo({ ...selectedNotes, ...updatedNoteDetails });
    notesList?.map((originalNote) => {
      if (originalNote.noteId === selectedNotes.noteId) {
        originalNote.title = updatedNoteDetails.title;
        originalNote.content = updatedNoteDetails.content;
      }
    });
    setNotesList([...notesList]);
    filteredNotesList?.map((filteredNote) => {
      if (filteredNote.noteId === selectedNotes.noteId) {
        filteredNote.title = updatedNoteDetails.title;
        filteredNote.content = updatedNoteDetails.content;
      }
    });
    setFilteredNotesList([...filteredNotesList]);
    saveNotesInLocalStorage(); // save data after updating each note title and content
  };

  /**
   * @name generateTagsList
   * @param none
   * @returns void
   * @desc used to form tags list to show on left nav
   */
  const generateTagsList = (): void => {
    let tagsList: string[] = [];
    notesList.forEach((eachNote) => {
      if (eachNote?.tags?.length) tagsList.push(...eachNote?.tags);
    });
    tagsList = Array.from(new Set(tagsList));
    setTagsList(tagsList);
  };

  /**
   * @name handleTagSelection
   * @param selectedTagItem<string>
   * @returns void
   * @desc used to filter the notes list based on tag selection
   */
  const handleTagSelection = (selectedTagItem: string): void => {
    setTagSelection(selectedTagItem);
    let filteredList: NoteDetails[] = [];
    if (selectedTagItem) {
      notesList.forEach((noteItem) => {
        if (noteItem?.tags?.indexOf(selectedTagItem) > -1) {
          filteredList.push(noteItem);
        }
      });
    } else {
      filteredList = [...notesList];
    }
    setFilteredNotesList([...filteredList]);
  };

  /**
   * @name updateSelectedTagsList
   * @param newTagValue<string>
   * @returns void
   * @desc used to update the tags list based on duplication check
   */
  const updateSelectedTagsList = (newTagValue: string): void => {
    const updatedSelectedNote = selectedNotes;
    if (updatedSelectedNote?.tags?.indexOf(newTagValue) < 0) {
      updatedSelectedNote?.tags?.push(newTagValue);
      setSelectedNoteInfo({ ...selectedNotes, ...updatedSelectedNote });
      setSelectedTags([...updatedSelectedNote.tags]);
      notesList?.map((originalNote) => {
        if (originalNote.noteId === selectedNotes.noteId) {
          originalNote.tags = updatedSelectedNote.tags;
        }
      });
      setNotesList([...notesList]);
      filteredNotesList?.map((filteredNote) => {
        if (filteredNote.noteId === selectedNotes.noteId) {
          filteredNote.tags = updatedSelectedNote.tags;
        }
      });
      setFilteredNotesList([...filteredNotesList]);
    }
    saveNotesInLocalStorage(); // save data after updating tags
  };

  const saveNotesInLocalStorage = (isNoteDeleted = '') => {
    let notesTOSave = [] as NoteDetails[];
    if (isNoteDeleted) {
      notesTOSave = notesList.filter(
        (eachNote) => eachNote.noteId !== isNoteDeleted
      );
    } else {
      notesTOSave = notesList.filter(
        (eachNote) => !eachNote.title || eachNote.title !== NEW_NOTE_TEXT
      );
    }
    localStorage.setItem(
      HYKE_NOTES_TEXT,
      notesTOSave ? JSON.stringify(notesTOSave) : JSON.stringify([])
    );
  };

  return (
    <div className='dash-board-component'>
      {/* left nav i.e., tags list code starts */}
      <div className='dash-board-component__left-nav'>
        <div
          className={`dash-board-component__left-nav__list ${
            !selectedTag ? 'active' : ''
          }`}
          onClick={() => {
            handleTagSelection('');
          }}
        >
          All Notes
        </div>
        {tagsList && tagsList.length ? (
          <div className='dash-board-component__left-nav__tags-list'>
            <div className='dash-board-component__left-nav__tags-list__title'>
              Tags
            </div>
            <div className='dash-board-component__left-nav__tags-list__list'>
              {tagsList?.map((tagItem) => (
                <span
                  className={selectedTag === tagItem ? 'active' : ''}
                  onClick={() => {
                    handleTagSelection(tagItem);
                  }}
                  key={tagItem}
                >
                  {tagItem}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {/* sidebar with notes list code starts */}
      <div className='dash-board-component__sidebar'>
        <div className='dash-board-component__sidebar__new-note'>
          <img
            src='/delete-icon.svg'
            onClick={() => {
              deleteNote();
            }}
          />
        </div>
        <div className='dash-board-component__sidebar__notes-list'>
          {filteredNotesList && filteredNotesList.length ? (
            <NotesList
              noteSelectionChange={handleNotesSelection}
              notesList={filteredNotesList}
              selectedNoteId={selectedNoteId}
            />
          ) : (
            <div className='dash-board-component__sidebar__notes-list__empty-list'>
              Please click on add button to create new note
            </div>
          )}
        </div>
      </div>
      {/* note details component code starts */}
      <div className='dash-board-component__body'>
        <div className='dash-board-component__body__new-note'>
          <img
            src='/edit-icon.svg'
            onClick={() => {
              addNewNote();
            }}
          />
        </div>
        {filteredNotesList && filteredNotesList.length ? (
          <NotesDetails
            selectedNotes={selectedNotes}
            updateNotes={updateSelectedNotes}
          />
        ) : null}
        {filteredNotesList && filteredNotesList.length ? (
          <TagList
            selectedTagsList={selectedTags}
            deleteTag={handleDeleteTag}
            addToTagsList={(updatedList: string) => {
              setTagsList((old) => [...old, updatedList]);
            }}
            tagsListForUniquenessCheck={tagsList}
            addUniqueTags={true}
            updateSelectedTagList={updateSelectedTagsList}
          />
        ) : null}
      </div>
    </div>
  );
};
export default Dashboard;
