import {loadFile} from "$helpers/loadFIle";
import path from "path";
import {circonscriptionJSONPath, deputeJSONPath} from "../../scripts/config";
import fs from "fs";
import {slugifyNames} from "$helpers/slugify";

export { ViewCircumscription as default } from '$views/ViewCircumscription/ViewCircumscription';

export async function getStaticProps ({ params }) {
    const file = (await loadFile(
        path.join(circonscriptionJSONPath, `${params.slug}.json`),
        'utf-8'
    )) as string;
    const circumscription = JSON.parse(file);
    const deputeFile = await loadFile(path.join(deputeJSONPath, `${slugifyNames(circumscription.current.firstname,circumscription.current.lastname)}.json`)) as string;
    return {
        props: {
            circumscription,
            depute: JSON.parse(deputeFile)
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
