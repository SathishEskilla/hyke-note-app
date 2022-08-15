/*
 * @Author: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Date: 2022-08-14 16:18:20
 * @Last Modified by: Sathish Eskilla <Sathish_Eskilla@hotmail.com>
 * @Last Modified time: 2022-08-15 14:18:20
 * @description: list for show post live client details
 */
import React, { useState } from 'react';

import './tag-list.scss';

const TagsList: React.FC<{
  deleteTag: Function;
  selectedTagsList: string[];
  addToTagsList: Function;
  addUniqueTags?: boolean; // added to use in different places as common component
  tagsListForUniquenessCheck: string[];
  updateSelectedTagList: Function;
}> = (props) => {
  const [tagInputValue, setTagInputValue] = useState('');

  /**
   * @name updateTagsList
   * @param inputValue<string>
   * @returns void
   * @desc used to update the tags list in details and left nav
   */
  const updateTagsList = (inputValue: string) => {
    if (!inputValue) return;
    if (
      props.tagsListForUniquenessCheck.indexOf(inputValue) < 0 &&
      props.addUniqueTags
    ) {
      props.addToTagsList(inputValue);
    }
    setTagInputValue(''); // resetting input value
    props.updateSelectedTagList(inputValue);
  };

  return (
    <div className='tags-list'>
      {props?.selectedTagsList?.map((eachTag) => (
        <div className='tags-list__wrapper tag-btn' key={eachTag}>
          <span>{eachTag}</span>
          <img
            src='/cross-icon.svg'
            onClick={() => {
              props.deleteTag(eachTag);
            }}
          />
        </div>
      ))}
      <input
        type='text'
        placeholder='Add tag...'
        onBlur={(event) => {
          updateTagsList(event.target.value);
        }}
        onChange={(event) => {
          setTagInputValue(event.target.value);
        }}
        value={tagInputValue}
      />
    </div>
  );
};

export default TagsList;
