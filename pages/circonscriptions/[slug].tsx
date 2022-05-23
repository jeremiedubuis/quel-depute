import {loadFile} from "$helpers/loadFIle";
import path from "path";
import {circonscriptionJSONPath} from "../../scripts/config";
import fs from "fs";

export { ViewCircumscription as default } from '$views/ViewCircumscription/ViewCircumscription';

export async function getStaticProps ({ params }) {
    const file = (await loadFile(
        path.join(circonscriptionJSONPath, `${params.slug}.json`),
        'utf-8'
    )) as string;
    return {
        props: {
            circumscription: JSON.parse(file)
        }
    };
}
export async function getStaticPaths() {
    const files: string[] = await new Promise((resolve) =>
        fs.readdir(circonscriptionJSONPath, (err, files) => resolve(files))
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
