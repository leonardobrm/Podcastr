import { Header } from "../components/Header";

export default function Home(props) {
  return <h1>{JSON.stringify(props.episodes)}</h1>
}

// usa no lugar do useEffect para fazer chamadas a api.
export async function getStaticProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}