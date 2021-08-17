/** convert raw bytes to a human-readable string */
export const humanFileSize = (bytes: number): string => {
  if (bytes <= 0) {
    return '0 bytes';
  }
  const e = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    (bytes / Math.pow(1000, e)).toFixed(1) + ' ' + ' kMGTP'.charAt(e) + 'B'
  );
};
