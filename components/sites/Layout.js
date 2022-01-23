import Head from "next/head";

export default function Layout({ meta, children }) {
  return (
    <div className="h-full">
      <Head>
        <title>{meta?.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
