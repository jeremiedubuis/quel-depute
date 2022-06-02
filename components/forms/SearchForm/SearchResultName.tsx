import styles from './SearchForm.module.css'
import React from 'react';

export const SearchResultName = ({ result: {
    firstname,
    lastname,
    candidate,
    current,
    county,
    circumscription
}}) => {

    return <div className={styles.nameResult}>
        {firstname} {lastname}
        <span>{candidate
            ? `Candidat${
                current ? ' et député sortant' : ''
            } de la criconscription ${county} (${circumscription})`
            : current
                ? `Député sortant de la circonscription ${county} (${circumscription})`
                : ''} </span>
    </div>

}