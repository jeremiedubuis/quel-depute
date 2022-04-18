import fs from 'fs';
import { Depute } from '$types/deputeTypes';
import { getDeputeCard } from '$helpers/getDeputeCard';
import { writeFile } from '$helpers/writeFile';
import { deputeCardPath, deputeJSONPath } from './config';

export const createThumbnail = async (depute: Depute) => {
    const buffer = await getDeputeCard(depute);
    await writeFile(deputeCardPath + depute.slug + '.jpg', buffer);
};
fs.readdir(deputeJSONPath, (err, files) => {
    if (err) console.log(err);
    else {
        Promise.all(files.map((file) => createThumbnail(require(deputeJSONPath + file)))).then(
            () => {
                process.exit(0);
            }
        );
    }
});
