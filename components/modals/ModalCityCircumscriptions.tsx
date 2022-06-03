import React from 'react';
import { Modal } from '$components/modals/Modal';
import { BaseDepute } from '$types/deputeTypes';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { ReactISlider } from 'react-i-slider';
import {cn} from "$helpers/cn";
import styles from "$components/depute/DeputeVotesSlider/DeputeVotesSlider.module.css";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";

export const ModalCityCircumscriptions: React.FC<{
    circumscriptions: any[];
    isVisible?: boolean;
    close: Function;
    deputes: BaseDepute[];
}> = ({ isVisible, circumscriptions, close, deputes }) => {
    return (
        <Modal isVisible={isVisible} close={close}>
            <h2>Circonscriptions de {circumscriptions[0].villageName}</h2>
            <p>{circumscriptions[0].villageName} compte {circumscriptions.length} circonscriptions:</p>
            <ReactISlider
                maxSlides={1}
                className={cn(styles.votes, styles.arrows)}
                prev={<FiChevronLeft />}
                next={<FiChevronRight />}
                arrows
                infinite={false}
            >
                {circumscriptions.map((c,i) => {
                    const depute = deputes.find(
                        (d) => d.circumscription === c.circumscriptionNumber
                    );
                    return (
                        <>
                            <DeputeBlock depute={depute} isLinkToCircumscription />
                            <div>{i+1}/{circumscriptions.length}</div>
                        </>
                    );
                })}
            </ReactISlider>
        </Modal>
    );
};
