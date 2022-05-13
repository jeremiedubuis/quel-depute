import { loadFile } from '$helpers/loadFIle';
import path from 'path';
import { deputeJSONPath, scrutinJSONPath } from '../../scripts/config';
import fs from 'fs';

export { ViewVote as default } from '$views/ViewVote/ViewVote';

export async function getStaticProps({ params }) {
    const file = (await loadFile(
        path.join(scrutinJSONPath, params.number + '.json'),
        'utf-8',
    )) as string;
    return {
        props: {
            scrutin: JSON.parse(file),
        },
    };
}

export async function getStaticPaths() {
    const files: string[] = await new Promise((resolve) =>
        fs.readdir(scrutinJSONPath, (err, files) => resolve(files)),
    );
    return {
        paths: files
            .filter((f) => f !== 'scrutins.json')
            .map((f) => ({
                params: {
                    number: f.replace('.json', ''),
                },
            })),
        fallback: false,
    };
}
