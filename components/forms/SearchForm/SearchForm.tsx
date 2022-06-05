import styles from './SearchForm.module.css';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { AutoComplete } from '$components/forms/AutoComplete/AutoComplete';
import { Button } from '$components/buttons/Button/Button';
import { FiMapPin } from 'react-icons/fi';
import { slugify, slugifyNames } from '$helpers/slugify';
import debounce from 'lodash/debounce';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { deputesListState } from '../../../atoms/deputesListState';
import { useRouter } from 'next/router';
import { ModalCityCircumscriptions } from '$components/modals/ModalCityCircumscriptions';
import { cn } from '$helpers/cn';
import { screenSizeState } from '../../../atoms/screeSizeState';
import { mobileSearchOpenState } from '../../../atoms/mobileSearchOpenState';
import { SearchResultName } from './SearchResultName';
import { Tooltip } from '$components/text/Tooltip/Tooltip';
import { AiFillWarning } from 'react-icons/ai';

export const SearchForm: React.FC<{ small?: boolean }> = ({ small }) => {
    const deputes = useRecoilValue(deputesListState);
    const [cities, setCities] = useState([]);
    const [deputeMatches, setDeputeMatches] = useState([]);
    const { push } = useRouter();
    const screenSize = useRecoilValue(screenSizeState);
    const [mobileSearchOpen, setMobileSearchOpen] = useRecoilState(mobileSearchOpenState);
    const [geoLocationError, setGeoLocationError] = useState(null);

    const [villageCircumscriptions, setVillageCircumscriptions] = useState<
        { countyId: number; countyName: string; circumscriptionNumber: number }[] | null
    >(null);

    useEffect(() => {
        setMobileSearchOpen(false);
    }, []);

    if (small && screenSize < 1024 && !mobileSearchOpen) return null;

    const selectVillage = async (county: string, village: string) => {
        const countySlug = slugify(county);
        const villages = await fetch(`/json/villages/${countySlug}.json`).then((r) => r.json());

        const circumscriptions = villages
            .filter(({ villageName }) => slugify(villageName) === slugify(village))
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

    const onGranted = () => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
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
            },
            () => {
                setGeoLocationError(true);
            }
        );
    };

    const getCity = () => {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            result.onchange = (e) => {
                if (result.state === 'granted') onGranted();
            };

            console.log(result.state);

            if (result.state === 'granted') {
                onGranted();
            } else if (result.state === 'prompt') {
                onGranted();
            } else if (result.state === 'denied') {
                return setGeoLocationError(true);
            }
            setGeoLocationError(null);
        });
    };

    const onNameInput = (e) => {
        if (e.currentTarget.value.length < 3) return setDeputeMatches([]);
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
                    {!small && (
                        <legend>
                            Qui sont nos député ? <br />
                            Environnement, inégalités, libertés. <br />
                            Comment ont-ils voté ?
                            <br />
                        </legend>
                    )}

                    <AutoComplete
                        className={styles.field}
                        onInput={onNameInput}
                        list={deputeMatches}
                        renderValue={({ firstname, lastname }) => `${firstname} ${lastname}`}
                        renderResult={(result) => <SearchResultName result={result} />}
                        onListClick={async (e, value) => {
                            await push(
                                `/circonscriptions/${slugify(
                                    `${value.county} ${value.circumscription}/`
                                )}`
                            );
                            window.location.hash = value.current ? '#depute' : '#candidats';
                        }}
                        id="form-name"
                        label="Nom"
                    />

                    <AutoComplete
                        className={styles.field}
                        onInput={onCityInput}
                        id="form-commune"
                        label="Commune"
                        renderResult={(city) => {
                            return `${city.nom} (${city.departement?.code})`;
                        }}
                        renderValue={({ nom }) => nom}
                        list={cities.filter((c) => c.departement)}
                        onListClick={(e, city) => selectVillage(city.departement.nom, city.nom)}
                    />
                    <Button icon={FiMapPin} onClick={() => getCity()} type="button">
                        {geoLocationError ? (
                            <Tooltip content="Veuillez autoriser la géolocalisation">
                                Gélocalisez moi !
                                <AiFillWarning />
                            </Tooltip>
                        ) : (
                            'Gélocalisez moi !'
                        )}
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
