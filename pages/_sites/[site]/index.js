import Layout from "@/components/sites/Layout";
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import prisma from "@/lib/prisma";

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
      <div className="w-full mb-20">
        <h1>Sale</h1>
      </div>
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
