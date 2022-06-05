import React, { useState } from 'react';
import { Button } from '$components/buttons/Button/Button';
import styles from './Share.module.css';
import { AiFillFacebook, AiFillTwitterCircle, AiOutlineShareAlt } from 'react-icons/ai';
import { FiX } from 'react-icons/fi';

export const Share: React.FC<{ url: string }> = ({ url }) => {
    const [shareOpen, setShareOpen] = useState(false);

    const socialNetworks = [
        {
            name: 'Facebook',
            Icon: AiFillFacebook,
            href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
        },
        {
            name: 'Twitter',
            Icon: AiFillTwitterCircle,
            href: 'http://twitter.com/share?url=' + encodeURIComponent(url)
        }
    ];

    return (
        <div>
            <Button className={styles.share} onClick={() => setShareOpen(!shareOpen)}>
                {shareOpen ? <FiX /> : <AiOutlineShareAlt />}
            </Button>
            {shareOpen && (
                <div className={styles.shareMenu}>
                    <ul>
                        {socialNetworks.map(({ name, Icon, href }) => (
                            <li key={name}>
                                <Button className={styles.button} href={href} target={'_blank'}>
                                    <Icon /> Partager sur {name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
