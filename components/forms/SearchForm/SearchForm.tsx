import styles from './SearchForm.module.css';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import { AutoComplete } from '$components/forms/AutoComplete/AutoComplete';
import { Button } from '$components/buttons/Button/Button';
import { FiMapPin } from 'react-icons/fi';
import { slugify, slugifyNames } from '$helpers/slugify';
import debounce from 'lodash/debounce';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import { deputesListState } from '../../../atoms/deputesListState';
import { useRouter } from 'next/router';
import { ModalCityCircumscriptions } from '$components/modals/ModalCityCircumscriptions';
import {cn} from "$helpers/cn";
import {screenSizeState} from "../../../atoms/screeSizeState";
import {mobileSearchOpenState} from "../../../atoms/mobileSearchOpenState";

export const SearchForm: React.FC<{small?: boolean}> = ({ small }) => {

    const deputes = useRecoilValue(deputesListState);
    const [cities, setCities] = useState([]);
    const [deputeMatches, setDeputeMatches] = useState([]);
    const { push } = useRouter();
    const screenSize = useRecoilValue(screenSizeState);
    const [mobileSearchOpen, setMobileSearchOpen] = useRecoilState(mobileSearchOpenState);

    const [villageCircumscriptions, setVillageCircumscriptions] = useState<
        { countyId: number; countyName: string; circumscriptionNumber: number }[] | null
    >(null);

    useEffect(() => {
        setMobileSearchOpen(false)
    }, [])

    if (small && screenSize < 1024 && !mobileSearchOpen) return null;

    const selectVillage = async (county: string, village: string) => {
        const countySlug = slugify(county);
        const villages = await fetch(`/json/villages/${countySlug}.json`).then((r) => r.json());

        const circumscriptions = villages
            .filter(({ villageName }) => villageName === village)
            .reduce((acc, curr) => {
                if (acc.find((v) => v.circumscriptionNumber === curr.circumscriptionNumber))
                    return acc;
                acc.push(curr);
                return acc;
            }, []);
        if (circumscriptions.length === 1)
            push(
                `/circonscriptions/${slugify(
                    `${countySlug} ${circumscriptions[0].circumscriptionNumber}`
                )}`
            );
        else setVillageCircumscriptions(circumscriptions);
    };

    const getCity = () => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=fr`
            )
                .then((r) => r.json())
                .then(async (r) => {
                    const county = r.localityInfo.administrative.find(
                        ({ adminLevel }) => adminLevel === 6
                    ).name;
                    const village = r.localityInfo.administrative.find(
                        ({ adminLevel }) => adminLevel === 8
                    ).name;
                    return selectVillage(county, village);
                });
        });
    };

    const onNameInput = (e) => {
        setDeputeMatches(
            deputes.filter(({ firstname, lastname }) => {
                const f = slugify(firstname);
                const l = slugify(lastname);
                const v = slugify(e.currentTarget.value);
                const vSpacesAsDashes = slugify(e.currentTarget.value.replace(' ', '-'));
                if (f.includes(v)) return true;
                if (l.includes(v)) return true;
                if ((f + ' ' + l).includes(v) || (f + ' ' + l).includes(vSpacesAsDashes))
                    return true;
                if ((l + ' ' + f).includes(v) || (l + ' ' + f).includes(vSpacesAsDashes))
                    return true;
                return false;
            })
        );
    };

    const fetchCities = debounce((name: string) => {
        const url = new URL('https://geo.api.gouv.fr/communes');
        url.searchParams.append('fields', 'departement');
        url.searchParams.append('boost', 'population');
        url.searchParams.append('limit', '10');
        url.searchParams.append('nom', name);
        fetch(url.toString())
            .then((r) => r.json())
            .then(setCities);
    }, 400);

    const onCityInput = (e: SyntheticEvent<HTMLInputElement>) => {
        fetchCities(e.currentTarget.value);
    };

    return (
        <>
            <form className={cn(styles.form, small && styles.small)}>
                <fieldset>
                    {!small && <legend>
                        Quel député lorem ipsum ?<br />
                        Dolor sit amet, consectetuer
                    </legend>}

                    <AutoComplete
                        className={styles.field}
                        onInput={onNameInput}
                        list={deputeMatches}
                        renderValue={({ firstname, lastname }) => `${firstname} ${lastname}`}
                        renderResult={({
                            firstname,
                            lastname,
                            current,
                            candidate,
                            county,
                            circumscription
                        }) =>
                            `${firstname} ${lastname} ${
                                candidate
                                    ? `Candidat${
                                          current ? ' et député sortant' : ''
                                      } de la criconscription ${county} (${circumscription})`
                                    : current
                                    ? `Député sortant de la circonscription ${county} (${circumscription})`
                                    : ''
                            }`
                        }
                        onListClick={(e, value) => {
                            push(
                                `/circonscriptions/${slugify(
                                    `${value.county} ${value.circumscription}`
                                )}`
                            );
                        }}
                        id="form-name"
                        label="Nom"
                    />

                    <AutoComplete
                        className={styles.field}
                        onInput={onCityInput}
                        id="form-commune"
                        label="Commune"
                        renderResult={(city) => `${city.nom} (${city.departement.code})`}
                        renderValue={({ nom }) => nom}
                        list={cities}
                        onListClick={(e, city) => selectVillage(city.departement.nom, city.nom)}
                    />
                    <Button icon={FiMapPin} onClick={() => getCity()} type="button">
                        Gélocalisez moi !
                    </Button>
                </fieldset>
            </form>
            {villageCircumscriptions && (
                <ModalCityCircumscriptions
                    close={() => setVillageCircumscriptions(null)}
                    circumscriptions={villageCircumscriptions}
                    deputes={deputes.filter(
                        (d) =>
                            d.current &&
                            villageCircumscriptions.find(
                                (v) =>
                                    v.countyId === d.countyId &&
                                    v.circumscriptionNumber === d.circumscription
                            )
                    )}
                    isVisible={true}
                />
            )}
        </>
    );
};
