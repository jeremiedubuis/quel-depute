import React, { ReactNode, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const DropDown: React.FC<{
    children: ReactNode | ReactNode[];
    className?: string;
    buttonStyle?: any;
    content: ReactNode | ReactNode[];
}> = ({ children, content, className, buttonStyle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <button style={buttonStyle} type="button" onClick={() => setIsOpen(!isOpen)}>
                {children}
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <div style={{ display: isOpen ? 'block' : 'none' }}>{content}</div>
        </div>
    );
};
