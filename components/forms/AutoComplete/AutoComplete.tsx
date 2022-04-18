import styles from './AutoComplete.module.css';
import React, { KeyboardEventHandler, SyntheticEvent, useEffect, useState } from 'react';
import { Field, FieldProps } from '../Field/Field';

type AutoCompleteProps = FieldProps & {
    onInput: (e: SyntheticEvent<HTMLInputElement>) => void;
    list: string[];
    onListClick?: (e: SyntheticEvent<any>, value: string) => void;
};

export const AutoComplete: React.FC<AutoCompleteProps> = ({
    label,
    id,
    onInput,
    list,
    onListClick
}) => {
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>();

    const [active, setActive] = useState(true);

    const onKeyDown: KeyboardEventHandler = (e) => {
        if (active) {
            if (e.key === 'ArrowDown') {
                const i = list.indexOf(selectedValue);
                setSelectedValue(list[i < list.length - 1 ? i + 1 : 0]);
            }
            if (e.key === 'ArrowUp') {
                const i = list.indexOf(selectedValue);
                setSelectedValue(list[i > 0 ? i - 1 : list.length - 1]);
            }

            if (e.key === 'Enter' || (e.key === 'Tab' && list.length)) {
                e.preventDefault();
                setValue(selectedValue);
                onListClick?.(e, selectedValue);
                setTimeout(() => setActive(false), 100);
            }
        }
    };

    useEffect(() => {
        setActive(list.length !== 1 || list[0] !== value);
    }, [list, value]);

    return (
        <Field className={styles.autocomplete} label={label} id={id}>
            <input
                id={id}
                onInput={(e) => {
                    setValue(e.currentTarget.value);
                    onInput(e);
                }}
                onFocus={(e) => setFocus(true)}
                onBlur={(e) => setTimeout(() => setFocus(false), 500)}
                onKeyDown={onKeyDown}
                value={value}
                autoComplete="off"
            />
            {focus && active && (
                <ul className={styles.list}>
                    {list.map((v, i) => (
                        <li key={v} className={selectedValue === v ? styles.selected : null}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    console.log(v);
                                    setValue(v);
                                    onListClick?.(e, v);
                                }}
                            >
                                {v}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </Field>
    );
};
