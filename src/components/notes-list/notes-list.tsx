/*
 * @Author: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Date: 2022-08-14 16:18:20
 * @Last Modified by: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Last Modified time: 2022-08-15 14:18:20
 * @description: list for show post live client details
 */

import React, { useEffect, useState } from 'react';
import { NoteDetails, SelectedNoteIdObj } from '../../types/global-model';

import './notes-list.scss';

const NotesList: React.FC<{
  noteSelectionChange: Function;
  notesList: NoteDetails[];
  selectedNoteId: SelectedNoteIdObj;
}> = (props) => {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  useEffect(() => {
    if (props?.selectedNoteId?.noteId) {
      props.notesList?.forEach((noteItem, index) => {
        if (noteItem.noteId === props.selectedNoteId.noteId) {
          props.noteSelectionChange(noteItem);
          setSelectedNoteIndex(index);
        }
      });
    }
  }, [props.selectedNoteId]);

  return (
    <div className='notes-list'>
      {props.notesList.map((eachNote, index) => (
        <div
          onClick={() => {
            props.noteSelectionChange(eachNote);
            setSelectedNoteIndex(index);
          }}
          key={`${eachNote.title} ${index}`}
          className={selectedNoteIndex === index ? 'active' : ''}
        >
          <span> {eachNote.title} </span>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
