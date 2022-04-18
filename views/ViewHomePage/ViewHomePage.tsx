import styles from './ViewHomePage.module.css';
import React, { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import debounce from 'lodash/debounce';
import { AutoComplete } from '$components/forms/AutoComplete/AutoComplete';
import { slugify } from '$helpers/slugify';
import Link from 'next/link';
import Head from 'next/head';
import { FiMapPin } from 'react-icons/fi';
import { Button } from '$components/buttons/Button/Button';
import { Loader } from '$components/layout/Loader/Loader';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { BaseDepute } from '$types/deputeTypes';

export const ViewHomePage: React.FC = () => {
    const [cities, setCities] = useState([]);
    const [deputes, setDeputes] = useState([]);
    const [deputeMatches, setDeputeMatches] = useState([]);
    const [results, setResults] = useState<{ results: BaseDepute[]; key: string }>();
    const [groups, setGroups] = useState<string[]>();
    const [selectedGroup, setSelectedGroup] = useState<string>();
    const [cityValue, setCityValue] = useState<string>('');
    const [nameValue, setNameValue] = useState<string>('');

    const setResultsFromCountyAndvillage = async (county: string, village: string) => {
        const villages = await fetch(`/json/villages/${slugify(county)}.json`).then((r) =>
            r.json()
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
                        ({ circumscriptionNumber }) => d.circumscription === circumscriptionNumber
                    )
            )
        });
    };

    const getCity = () => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            console.log(coords);
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
                if (f.includes(v)) return true;
                if (l.includes(v)) return true;
                if ((f + ' ' + l).includes(v)) return true;
                if ((l + ' ' + f).includes(v)) return true;
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

    useEffect(() => {
        fetch('/json/deputes.json')
            .then((r) => r.json())
            .then((d) => {
                setDeputes(d);
                setGroups(
                    d.reduce((acc, curr) => {
                        if (!acc.includes(curr.group)) acc.push(curr.group);
                        return acc;
                    }, [])
                );
            });
    }, []);

    return (
        <main className={styles.view}>
            <Head>
                <title>Quel député ?</title>
            </Head>
            <form>
                <fieldset>
                    <legend>Trouver son député</legend>

                    <AutoComplete
                        onInput={onNameInput}
                        list={deputeMatches.map(
                            ({ firstname, lastname }) => `${firstname} ${lastname}`
                        )}
                        onListClick={(e, value) => {
                            const [firstname, lastname] = value.split(' ');
                            setResults({
                                key: value,
                                results: [
                                    deputes.find(
                                        (d) => d.firstname === firstname && d.lastname === lastname
                                    )
                                ]
                            });
                        }}
                        id="form-name"
                        label="Nom"
                    />

                    <AutoComplete
                        onInput={onCityInput}
                        id="form-commune"
                        label="Commune"
                        onListClick={(e, v) => {
                            const city = v.replace(/ \(\d+\)/, '');
                            const countyCode = v.match(/\((\d+)\)/)[1];
                            const { nom, departement } = cities.find(
                                (c) => c.nom === city && c.departement.code === countyCode
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
                                <DeputeBlock depute={r} />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h2>Groupes parlementaires</h2>

            {!groups ? (
                <Loader />
            ) : (
                <ul className={styles.groups}>
                    {groups.map((g) => (
                        <li key={g}>
                            <button onClick={() => setSelectedGroup(g)}>{g}</button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedGroup && (
                <>
                    <h3>{selectedGroup}</h3>
                    <ul className={styles.results}>
                        {deputes
                            .filter((d) => d.group === selectedGroup)
                            .map((d) => (
                                <li key={d.id}>
                                    <DeputeBlock depute={d} />
                                </li>
                            ))}
                    </ul>
                </>
            )}
        </main>
    );
};
