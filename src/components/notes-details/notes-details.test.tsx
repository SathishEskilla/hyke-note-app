import React from 'react';
import { render, screen } from '@testing-library/react';
import NotesDetails from './notes-details';
import { NoteDetails } from '../../types/global-model';

test('renders learn react link', () => {
  render(
    <NotesDetails selectedNotes={{} as NoteDetails} updateNotes={() => {}} />
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
