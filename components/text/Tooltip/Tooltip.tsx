import styles from './Tooltip.module.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { DirectionX, DirectionY, getAbsolutePosition } from '$helpers/getAbsolutePosition';
import { cn } from '$helpers/cn';

type TooltipProps = {
    Tag?: keyof JSX.IntrinsicElements;
    children?: React.ReactNode | React.ReactNode[];
    triggersOnHover?: boolean;
    triggersOnClick?: boolean;
    delay?: number;
    direction?: [DirectionX, DirectionY];
    contentSizedByTrigger?: boolean;
    content: React.ReactNode | React.ReactNode[];
    className?: string;
    contentClassName?: string;
};

export const Tooltip: React.FC<TooltipProps> = ({
    Tag = 'div',
    children,
    triggersOnHover = true,
    triggersOnClick,
    delay = 150,
    direction = [DirectionX.Right, DirectionY.Top],
    contentSizedByTrigger,
    content,
    className,
    contentClassName,
}) => {
    const triggerRef = useRef<HTMLElement>();
    const absoluteRef = useRef<HTMLDivElement>();
    const [style, setStyle] = useState(null);
    const timeout = useRef(null);
    const isVisibleRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        isVisibleRef.current = isVisible;
        if (isVisible) {
            setStyle(
                getAbsolutePosition(triggerRef, absoluteRef, direction, contentSizedByTrigger),
            );
        }
    }, [isVisible]);

    useEffect(() => {
        if (triggersOnHover) {
            triggerRef.current.addEventListener('mouseover', () => {
                clearTimeout(timeout.current);
                setIsVisible(true);
            });
            triggerRef.current.addEventListener('mouseout', () => {
                timeout.current = setTimeout(() => setIsVisible(false), delay);
            });
        }
        if (triggersOnClick) {
            triggerRef.current.addEventListener('click', () => {
                setIsVisible(!isVisibleRef.current);
            });
        }

        return () => clearTimeout(timeout.current);
    }, []);

    const hide = () => {
        timeout.current = setTimeout(() => setIsVisible(false), delay);
    };
    const show = () => {
        clearTimeout(timeout.current);
        setIsVisible(true);
    };
    return (
        <>
            {/*@ts-ignore*/}
            <Tag ref={triggerRef} className={cn(styles.tooltip, className)}>
                {children}
            </Tag>
            {isVisible &&
                ReactDOM.createPortal(
                    <div
                        className={cn(styles.content, contentClassName)}
                        style={{
                            position: 'absolute',
                            ...(style || {}),
                        }}
                        ref={absoluteRef}
                        onMouseOver={triggersOnHover ? show : undefined}
                        onMouseOut={triggersOnHover ? hide : undefined}
                    >
                        {content}
                    </div>,
                    document.body,
                )}
        </>
    );
};
