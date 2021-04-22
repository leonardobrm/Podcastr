import format from 'date-fns/format';
import Image from 'next/image';
import parseISO from 'date-fns/parseISO';
import prBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../../services/api';
import { converDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';
import Link from 'next/link';

interface Episode {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    published_at: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
  }
  interface EpisodeProps {
    episode: Episode;
  }

export default function Episode({ episode }: EpisodeProps) {
    const router = useRouter();


    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="voltar"/>
                    </button>
                </Link>
                <Image 
                   width={700}
                   height={160}
                   src={episode.thumbnail}
                   objectFit="cover"
                />
                <button type="button">
                    <img src="/play.svg" alt="tocar episodio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.descripiton} dangerouslySetInnerHTML={{__html: episode.description}} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
            locale: prBR
        }),
        duration: Number(data.file.duration),
        durationAsString: converDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        thumbnail: data.thumbnail
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24,
    }
}