import { deputeJSONPath } from '../../scripts/config';
import path from 'path';
import fs from 'fs';
import { loadFile } from '$helpers/loadFIle';

export { ViewDepute as default } from '$views/ViewDepute/ViewDepute';

export async function getStaticProps({ params }) {
    const file = (await loadFile(
        path.join(deputeJSONPath, `${params.slug}.json`),
        'utf-8'
    )) as string;
    return {
        props: {
            depute: JSON.parse(file)
        }
    };
}

export async function getStaticPaths() {
    const files: string[] = await new Promise((resolve) =>
        fs.readdir(deputeJSONPath, (err, files) => resolve(files))
    );
    return {
        paths: files.map((f) => ({
            params: {
                slug: f.replace('.json', '')
            }
        })),
        fallback: false
    };
}
