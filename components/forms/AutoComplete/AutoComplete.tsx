import styles from './AutoComplete.module.css';
import React, { KeyboardEventHandler, SyntheticEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldProps } from '../Field/Field';
import { cn } from '$helpers/cn';
import { DirectionX, DirectionY, getAbsolutePosition } from '$helpers/getAbsolutePosition';

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
    onListClick,
    className
}) => {
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>();
    const [style, setStyle] = useState(null);
    const triggerRef = useRef();
    const absoluteRef = useRef();

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

    useEffect(() => {
        if (active && focus)
            setStyle(
                getAbsolutePosition(
                    triggerRef,
                    absoluteRef,
                    [DirectionX.LeftInner, DirectionY.Bottom],
                    true
                )
            );
    }, [active, focus]);

    return (
        <Field
            className={cn(styles.autocomplete, className)}
            label={label}
            id={id}
            wrapperRef={triggerRef}
        >
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
            {focus &&
                active &&
                ReactDOM.createPortal(
                    <ul className={styles.list} ref={absoluteRef} style={style}>
                        {list.map((v, i) => (
                            <li key={v} className={selectedValue === v ? styles.selected : null}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        setValue(v);
                                        onListClick?.(e, v);
                                    }}
                                >
                                    {v}
                                </button>
                            </li>
                        ))}
                    </ul>,
                    document.body
                )}
        </Field>
    );
};
