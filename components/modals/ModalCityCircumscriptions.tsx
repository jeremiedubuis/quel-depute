import React from 'react';
import { Modal } from '$components/modals/Modal';
import { slugify } from '$helpers/slugify';
import Link from 'next/link';
import { BaseDepute } from '$types/deputeTypes';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';

export const ModalCityCircumscriptions: React.FC<{
    circumscriptions: any[];
    isVisible?: boolean;
    close: Function;
    deputes: BaseDepute[];
}> = ({ isVisible, circumscriptions, close, deputes }) => {
    return (
        <Modal isVisible={isVisible} close={close}>
            <h2>Circonscriptions de {circumscriptions[0].villageName}</h2>
            <ul>
                {circumscriptions.map((c) => {
                    const depute = deputes.find(
                        (d) => d.circumscription === c.circumscriptionNumber
                    );
                    return (
                        <li>
                            <DeputeBlock depute={depute} isLinkToCircumscription />
                        </li>
                    );
                })}
            </ul>
        </Modal>
    );
};
