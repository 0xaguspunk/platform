import { signIn } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import LoadingDots from "@/components/app/loading-dots";

const pageTitle = "Login";
const logo = "/favicon.ico";

export default function Login() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={logo} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/logo.png"
          alt="Platforms Starter Kit"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Manifold Single Page Auctions Creator
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Build your Single Page Auction with custom domains.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              signIn("spotify");
            }}
            className={`${
              loading ? "cursor-not-allowed bg-[#1DB954]" : "bg-[#1DB954]"
            } group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 rounded-md focus:outline-none`}
          >
            {loading ? (
              <LoadingDots color="#fff" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" version="1.1" viewBox="0 0 168 168">
                <path d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z" fill="#fff"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
