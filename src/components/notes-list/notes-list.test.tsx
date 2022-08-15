import React from 'react';
import { render, screen } from '@testing-library/react';
import NotesList from './notes-list';
import { SelectedNoteIdObj } from '../../types/global-model';

test('renders learn react link', () => {
  render(
    <NotesList
      noteSelectionChange={() => {}}
      notesList={[]}
      selectedNoteId={{} as SelectedNoteIdObj}
    />
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
