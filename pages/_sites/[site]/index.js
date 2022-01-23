import Layout from "@/components/sites/Layout";
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default function Index(props) {
  const router = useRouter();
  if (router.isFallback) {
    return <Loader />;
  }

  const data = JSON.parse(props.data);

  const meta = {
    title: data.name,
    logo: "/logo.png",
  };

  return (
    <Layout meta={meta} subdomain={data.subdomain}>
      <header className="w-full p-10 flex justify-end">
        <button type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Connect wallet
        </button>
      </header>
      {data.type === 'mint' &&
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">Broken Punks</h1>
          <Image
            src="/broken-punk.png"
            alt="Broken Punk"
            width={300}
            height={300}
          />
          <button type="button" className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Mint
          </button>
        </div>
      }
      {data.type === 'redeem' &&
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">Broken Punks</h1>
        <Image
          src="/broken-punk.png"
          alt="Broken Punk"
          width={300}
          height={300}
        />
        <button type="button" className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Redeem
        </button>
      </div>
      }
      {data.type === 'auction' &&
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">Broken Punks</h1>
        <Image
          src="/broken-punk.png"
          alt="Broken Punk"
          width={300}
          height={300}
        />
        <button type="button" className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Bid
        </button>
      </div>
      }
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-center lg:px-8 flex-col">
          <Image
            src="/favicon.ico"
            alt="Broken Punk"
            width={20}
            height={20}
          />
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-black">Powered by Manifold</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}

export async function getStaticPaths() {
  const subdomains = await prisma.site.findMany({
    select: {
      subdomain: true,
    },
  });
  const customDomains = await prisma.site.findMany({
    where: {
      NOT: {
        customDomain: null,
      },
    },
    select: {
      customDomain: true,
    },
  });
  const allPaths = [
    ...subdomains.map((subdomain) => {
      return subdomain.subdomain;
    }),
    ...customDomains.map((customDomain) => {
      return customDomain.customDomain;
    }),
  ];
  return {
    paths: allPaths.map((path) => {
      return { params: { site: path } };
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params: { site } }) {
  let filter = {
    subdomain: site,
  };
  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }
  const data = await prisma.site.findUnique({
    where: filter,
    include: {
      user: true,
    },
  });

  if (!data) {
    return { notFound: true, revalidate: 10 };
  }

  return {
    props: {
      data: JSON.stringify(data),
    },
    revalidate: 10,
  };
}
