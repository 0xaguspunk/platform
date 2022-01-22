import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function Layout({ meta, children }) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.pageYOffset > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div>
      <Head>
        <title>{meta?.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`fixed w-full ${
          scrolled ? "drop-shadow-md" : ""
        }  top-0 left-0 right-0 h-16 bg-white z-30 transition-all ease duration-150 flex`}
      >
        {" "}
        <div className="flex justify-center items-center space-x-5 h-full max-w-screen-xl mx-auto px-10 sm:px-20">
          <Link href="/">
            <a className="flex justify-center items-center">
              <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                <Image
                  src={meta?.logo}
                  width={40}
                  height={40}
                  alt={meta?.title}
                />
              </div>
              <span className="inline-block ml-3 font-medium truncate">
                {meta?.title}
              </span>
            </a>
          </Link>
        </div>
      </div>
      <div className="mt-20">{children}</div>
    </div>
  );
}
