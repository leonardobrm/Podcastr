import { GetStaticProps } from "next";
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import prBR from 'date-fns/locale/pt-BR';
import { api } from "../../services/api";
import { converDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from './home.module.scss';

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
interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(ep => (
            <li key={ep.id}>
              <Image
                width={192}
                height={192}
                objectFit="cover"
                src={ep.thumbnail}
                alt={ep.title}
              />

              <div className={styles.episodesDetails}>
                <Link href={`/episodes/${ep.id}`}>
                  <a>{ep.title}</a>
                </Link>
                <p>{ep.members}</p>
                <span>{ep.publishedAt}</span>
                <span>{ep.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(ep => (
              <tr key={ep.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={ep.thumbnail}
                    alt={ep.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${ep.id}`}>
                    <a>{ep.title}</a>
                  </Link>
                </td>
                <td>{ep.members}</td>
                <td style={{ width: 100 }}>{ep.publishedAt}</td>
                <td>{ep.durationAsString}</td>
                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar Episodio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

// usa no lugar do useEffect para fazer chamadas a api.
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: prBR
      }),
      duration: Number(episode.file.duration),
      durationAsString: converDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
      thumbnail: episode.thumbnail
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}