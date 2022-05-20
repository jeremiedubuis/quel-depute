import fs from 'fs';
import path from 'path';
export const emptyDir = (directory: string) =>
    new Promise((resolve, reject) => {
        fs.readdir(directory, async (err, files) => {
            if (err) return reject(err);
            try {
                for (const file of files) {
                    await new Promise((resolve, reject) => {
                        fs.unlink(path.join(directory, file), (err) => {
                            if (err) reject(err);
                            resolve(null);
                        });
                    });
                }
                resolve(null);
            } catch (e) {
                reject(e);
            }
        });
    });
