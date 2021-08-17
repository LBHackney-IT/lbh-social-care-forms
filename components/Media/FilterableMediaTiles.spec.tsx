import { render, screen } from '@testing-library/react';
import { mockedMedia } from 'factories/media';
import FilterableMediaTiles from './FilterableMediaTiles';

describe('FilterableMediaTiles', () => {
  it('renders a clickable list of media', () => {
    render(
      <FilterableMediaTiles media={[mockedMedia, mockedMedia, mockedMedia]} />
    );
    expect(screen.getAllByRole('listitem').length).toBe(3 + 6);
    expect(screen.getAllByRole('button').length).toBe(3);
  });
});
