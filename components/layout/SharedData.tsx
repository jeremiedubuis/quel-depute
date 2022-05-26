import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { deputesListState } from '../../atoms/deputesListState';
import { groupsListState } from '../../atoms/groupsListState';
import { screenSizeState } from '../../atoms/screeSizeState';

export const SharedData = () => {
    const [deputes, setDeputes] = useRecoilState(deputesListState);
    const setGroups = useSetRecoilState(groupsListState);
    const setSize = useSetRecoilState(screenSizeState);

    useEffect(() => {
        if (!deputes.length) {
            fetch('/json/deputes/deputes.json')
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
        const resize = () => setSize(window.innerWidth);
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);
    return null;
};
