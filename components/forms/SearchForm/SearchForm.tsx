import styles from './SearchForm.module.css';
import React, { SyntheticEvent, useState } from 'react';
import { AutoComplete } from '$components/forms/AutoComplete/AutoComplete';
import { Button } from '$components/buttons/Button/Button';
import { FiMapPin } from 'react-icons/fi';
import { slugify } from '$helpers/slugify';
import debounce from 'lodash/debounce';
import { BaseDepute } from '$types/deputeTypes';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { useRecoilValue } from 'recoil';
import { deputesListState } from '../../../atoms/deputesListState';

export const SearchForm: React.FC = () => {
    const deputes = useRecoilValue(deputesListState);
    const [cities, setCities] = useState([]);
    const [cityValue, setCityValue] = useState<string>('');
    const [nameValue, setNameValue] = useState<string>('');
    const [deputeMatches, setDeputeMatches] = useState([]);
    const [results, setResults] = useState<{ results: BaseDepute[]; key: string }>();

    const setResultsFromCountyAndvillage = async (county: string, village: string) => {
        const villages = await fetch(`/json/villages/${slugify(county)}.json`).then((r) =>
            r.json(),
        );

        const villageCircumscriptions = villages
            .filter(({ villageName }) => villageName === village)
            .reduce((acc, curr) => {
                if (acc.find((v) => v.circumscriptionNumber === curr.circumscriptionNumber))
                    return acc;
                acc.push(curr);
                return acc;
            }, []);

        setResults({
            key: village,
            results: deputes.filter(
                (d) =>
                    d.county === county &&
                    villageCircumscriptions.find(
                        ({ circumscriptionNumber }) => d.circumscription === circumscriptionNumber,
                    ),
            ),
        });
    };

    const getCity = () => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            console.log(coords);
            fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=fr`,
            )
                .then((r) => r.json())
                .then(async (r) => {
                    const county = r.localityInfo.administrative.find(
                        ({ adminLevel }) => adminLevel === 6,
                    ).name;
                    const village = r.localityInfo.administrative.find(
                        ({ adminLevel }) => adminLevel === 8,
                    ).name;

                    setResultsFromCountyAndvillage(county, village);
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
            }),
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
            <form className={styles.form}>
                <fieldset>
                    <legend>
                        Quel député lorem ipsum ?<br />
                        Dolor sit amet, consectetuer
                    </legend>

                    <AutoComplete
                        className={styles.field}
                        onInput={onNameInput}
                        list={deputeMatches.map(
                            ({ firstname, lastname }) => `${firstname} ${lastname}`,
                        )}
                        onListClick={(e, value) => {
                            const [firstname, lastname] = value.split(' ');
                            setResults({
                                key: value,
                                results: [
                                    deputes.find(
                                        (d) => d.firstname === firstname && d.lastname === lastname,
                                    ),
                                ],
                            });
                        }}
                        id="form-name"
                        label="Nom"
                    />

                    <AutoComplete
                        className={styles.field}
                        onInput={onCityInput}
                        id="form-commune"
                        label="Commune"
                        onListClick={(e, v) => {
                            const city = v.replace(/ \(\d+\)/, '');
                            const countyCode = v.match(/\((\d+)\)/)[1];
                            const { nom, departement } = cities.find(
                                (c) => c.nom === city && c.departement.code === countyCode,
                            );
                            setResultsFromCountyAndvillage(departement.nom, nom);
                        }}
                        list={cities.map(({ nom, departement }) => `${nom} (${departement?.code})`)}
                    />
                    <Button icon={FiMapPin} onClick={() => getCity()} type="button">
                        Gélocalisez moi !
                    </Button>
                </fieldset>
            </form>

            {results && (
                <>
                    <h2>Résulat de recherche: {results.key}</h2>
                    <ul className={styles.results}>
                        {results.results.map((r) => (
                            <li key={r.id}>
                                <DeputeBlock
                                    isLink
                                    depute={r}
                                    onClick={() => setResults(undefined)}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};
