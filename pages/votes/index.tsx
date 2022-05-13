import { loadFile } from '$helpers/loadFIle';
import path from 'path';
import { deputeJSONPath, scrutinJSONPath } from '../../scripts/config';

export { ViewVotes as default } from '$views/ViewVotes/ViewVotes';

export async function getStaticProps() {
    const file = (await loadFile(path.join(scrutinJSONPath, 'scrutins.json'), 'utf-8')) as string;
    return {
        props: {
            scrutins: JSON.parse(file),
        },
    };
}
