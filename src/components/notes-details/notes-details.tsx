/*
 * @Author: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Date: 2022-08-14 16:18:20
 * @Last Modified by: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Last Modified time: 2022-08-15 14:18:20
 * @description: list for show post live client details
 */

import React, { useRef } from 'react';
import Textarea from 'react-expanding-textarea';
import { NoteDetails } from '../../types/global-model';
import './notes-details.scss';

const NotesDetails: React.FC<{
  selectedNotes: NoteDetails;
  updateNotes: Function;
}> = (props) => {
  const textAreaRef = useRef(null);

  /**
   * @name handleChange
   * @param inputValue: string, controlName<'content' | 'title'>
   * @returns void
   * @desc used to update the note details
   */
  const handleChange = (
    inputValue: string,
    controlName: 'content' | 'title'
  ) => {
    props.selectedNotes[controlName] = inputValue;
    props.updateNotes(props.selectedNotes);
  };

  return (
    <div className='notes_details'>
      <div className='notes_details__title'>
        <input
          type='text'
          value={props?.selectedNotes?.title ? props.selectedNotes.title : ''}
          onChange={(event) => {
            handleChange(event.target.value, 'title');
          }}
        />
      </div>
      <div className='notes_details__content'>
        <Textarea
          ref={textAreaRef}
          value={
            props?.selectedNotes?.content ? props.selectedNotes.content : ''
          }
          onChange={(event) => {
            handleChange(event.target.value, 'content');
          }}
        />
      </div>
    </div>
  );
};

export default NotesDetails;
