import fs from 'fs';

export const writeFile = (name: string, content: Buffer | string) =>
    new Promise((resolve, reject) => {
        fs.writeFile(name, content, (err) => {
            if (err) reject(err);
            resolve(null);
        });
    });
