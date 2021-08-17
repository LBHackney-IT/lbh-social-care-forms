import { humanFileSize } from './media';

describe('File size helper', () => {
  it('returns correct strings with the right number of decimal places', () => {
    expect(humanFileSize(0)).toEqual('0 bytes');
    expect(humanFileSize(1000)).toEqual('1.0 kB');
    expect(humanFileSize(1000000)).toEqual('1.0 MB');
    expect(humanFileSize(1000000000)).toEqual('1.0 GB');
    expect(humanFileSize(-10)).toEqual('0 bytes');
  });
});
