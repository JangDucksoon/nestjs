import * as crypto from 'crypto';

export class EncryptionUtil {
    private static readonly algorithm = 'aes-256-cbc';
    private static  key: Buffer;

    public static initialize(encryptionKey: string) {
        this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
    }

    public static encrypt(text: string) {
        if (!this.key) {
            throw new Error('EncryptionUtil not initialized. Call initialize() first.');
        }

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text, 'utf-8', 'hex');
        encrypted += cipher.final('hex');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    public static decrypt(encryptedText: string) {
        if (!this.key) {
            throw new Error('EncryptionUtil not initialized. Call initialize() first.');
        }

        const [ivHex, encrypted] = encryptedText?.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

        let decrypted: string = decipher.update(encrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }
}