import { getErrorMessage, CommerceError } from './commerce-errors';

describe('Centralized Error Management', () => {
  it('returns generic message for unknown error code', () => {
    const error = new CommerceError('UNKNOWN_CODE');
    expect(getErrorMessage(error)).toBe('An unexpected error occurred. Please try again.');
  });

  it('returns specific message for known error code', () => {
    const error = new CommerceError('OUT_OF_STOCK');
    expect(getErrorMessage(error)).toBe('This product is currently out of stock.');
  });

  it('handles regular Error objects', () => {
    const error = new Error('Random system failure');
    expect(getErrorMessage(error)).toBe('Random system failure');
  });

  it('handles strings', () => {
    expect(getErrorMessage('Just a string error')).toBe('Just a string error');
  });
});
