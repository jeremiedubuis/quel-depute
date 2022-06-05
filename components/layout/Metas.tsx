import React from 'react';
import Head from 'next/head';

export const Metas: React.FC<{
    title: string;
    description?: string;
    image?: { src: string; width?: string; height: string };
}> = ({ title, image, description }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
            {description && <meta name="description" content={description} />}
            {image && (
                <>
                    <meta property="twitter:image" content={image.src} />
                    <meta property="og:image" content={image.src} />
                    {image.width && <meta property="og:image:width" content={image.width} />}
                    {image.height && <meta property="og:image:height" content={image.height} />}
                </>
            )}
        </Head>
    );
};
