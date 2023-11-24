import { scrypt, randomBytes } from 'crypto';

export default class Password {
  private static saltLength = 16;
  private static keyLength = 48;

  static async hash(password: string): Promise<string> {
    return new Promise((res, rej) => {
      const salt = randomBytes(Password.saltLength).toString('hex');
      scrypt(password, salt, Password.keyLength, (err, derivedKey) => {
        if (err) {
          return rej(err);
        }
        res(`${salt}.${derivedKey.toString('hex')}`);
      });
    });
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return new Promise((res, rej) => {
      const [salt, key] = hash.split('.');
      scrypt(password, salt, Password.keyLength, (err, derivedKey) => {
        if (err) {
          return rej(err);
        }
        res(derivedKey.toString('hex') === key);
      });
    });
  }
}
