import { fireEvent, render, screen } from '@testing-library/react';
import { mockedMedia } from 'factories/media';
import MediaDetailDialog from './MediaDetailDialog';

describe('MediaDetailDialog', () => {
  it('correctly summarises the metadata, including file size', () => {
    render(
      <MediaDetailDialog
        media={mockedMedia}
        isOpen={true}
        onDismiss={jest.fn()}
      />
    );
    expect(screen.getByText('Example media file'));
    expect(screen.getByText('20.0 MB', { exact: false }));
  });

  it('fires the dismiss handler', () => {
    const mockHandler = jest.fn();
    render(
      <MediaDetailDialog
        media={mockedMedia}
        isOpen={true}
        onDismiss={mockHandler}
      />
    );
    fireEvent.click(screen.getByText('Close'));
    expect(mockHandler).toBeCalledTimes(1);
  });
});
