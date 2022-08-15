import React from 'react';
import { render, screen } from '@testing-library/react';
import TagList from './tag-list';

test('renders learn react link', () => {
  render(
    <TagList
      deleteTag={() => {}}
      selectedTagsList={[]}
      addToTagsList={() => {}}
      tagsListForUniquenessCheck={[]}
      updateSelectedTagList={() => {}}
    />
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
