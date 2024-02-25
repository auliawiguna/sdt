import * as bcrypt from 'bcrypt';
import { generateHash, validateHash } from './hash'; // Replace 'yourFile' with the actual file name

jest.mock('bcrypt');

describe('generateHash', () => {
  it('should generate a hash', () => {
    const password = 'testPassword';
    const mockHashSync = jest
      .spyOn(bcrypt, 'hashSync')
      .mockReturnValue('mockedHash');

    const result = generateHash(password);

    expect(mockHashSync).toHaveBeenCalledWith(password, 10);
    expect(result).toBe('mockedHash');
  });
});

describe('validateHash', () => {
  it('should return false if either password or hash is undefined', async () => {
    const mockCompare = jest.spyOn(bcrypt, 'compare');

    const result1 = await validateHash(undefined, 'someHash');
    const result2 = await validateHash('somePassword', undefined);

    expect(result1).toBe(false);
    expect(result2).toBe(false);
    expect(mockCompare).not.toHaveBeenCalled();
  });

  it('should compare password and hash using bcrypt.compare', async () => {
    const password = 'testPassword';
    const hash = 'testHash';
    const mockCompare = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await validateHash(password, hash);

    expect(mockCompare).toHaveBeenCalledWith(password, hash);
    expect(result).toBe(true);
  });
});
