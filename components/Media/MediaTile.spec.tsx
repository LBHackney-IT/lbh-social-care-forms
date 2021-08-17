import { render, screen, fireEvent } from '@testing-library/react';
import { mockedMedia } from 'factories/media';
import MediaTile from 'components/Media/MediaTile';

describe('MediaTile', () => {
  it('renders an image preview, title and metadata', () => {
    render(<MediaTile media={mockedMedia} />);

    expect(screen.getByRole('img'));
    expect(screen.getByRole('heading'));
    expect(screen.getByText('Example media file'));
    expect(screen.getByText('Uploaded 21 Jun 2021 by foo.bar@hackney.gov.uk'));
  });

  it('launches the detail dialog', () => {
    render(<MediaTile media={mockedMedia} />);

    expect(screen.queryByRole('dialog')).toBeNull;
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog'));
  });

  it('gracefully hides the uploading user if it is not available', () => {
    render(
      <MediaTile
        media={{
          ...mockedMedia,
          uploadedBy: null,
        }}
      />
    );
    expect(screen.getByText('Uploaded 21 Jun 2021'));
  });
});
