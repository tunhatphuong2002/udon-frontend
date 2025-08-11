export const ensureBuffer = (input: Buffer | string): Buffer => {
  if (typeof input === 'string') {
    return Buffer.from(input, 'hex');
  }
  return input;
};

export const ensureString = (input: Buffer | string): string => {
  if (typeof input === 'string') {
    return input;
  }
  return input.toString('hex');
};
