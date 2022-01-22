import Head from "next/head";

export default function Home() {
  return (
    <div className="flex h-screen bg-black">
      <Head>
        <title>Manifold SPAs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
