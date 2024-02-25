import * as bcrypt from 'bcrypt';

export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}
