import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { deputesListState } from '../../atoms/deputesListState';
import { groupsListState } from '../../atoms/groupsListState';

export const SharedData = () => {
    const [deputes, setDeputes] = useRecoilState(deputesListState);
    const setGroups = useSetRecoilState(groupsListState);

    useEffect(() => {
        if (!deputes.length) {
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
        }
    }, []);
    return null;
};
