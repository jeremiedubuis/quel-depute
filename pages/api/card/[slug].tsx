import { getDeputeCard } from '$helpers/getDeputeCard';
import { loadFile } from '$helpers/loadFIle';
import path from 'path';
import { deputeJSONPath } from '../../../scripts/config';

export default async function handler(req, res) {
    const { slug } = req.query;
    const file = (await loadFile(path.join(deputeJSONPath, `${slug}.json`), 'utf-8')) as string;
    res.setHeader('content-type', 'image/jpeg');
    return res.end(await getDeputeCard(JSON.parse(file)));
}
