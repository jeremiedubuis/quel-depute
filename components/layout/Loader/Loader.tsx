import styles from './Loader.module.css';
import { BiLoaderAlt } from 'react-icons/bi';

export const Loader = () => (
    <div className={styles.loader}>
        <BiLoaderAlt />
    </div>
);
