import fs from 'fs';
import path from 'path';

export const loadFile = (src: string, encoding?: 'utf-8'): Promise<Buffer | string> =>
    new Promise((resolve, reject) =>
        fs.readFile(
            path.join(process.cwd(), src.replace(process.cwd(), '')),
            encoding,
            (err, file) => {
                if (err) return reject(err);
                resolve(file);
            }
        )
    );
