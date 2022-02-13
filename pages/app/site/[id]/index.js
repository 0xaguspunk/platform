import { useState, useEffect } from "react";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import DomainCard from "@/components/app/DomainCard";
import Modal from "@/components/Modal";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SiteSettings() {
  const router = useRouter();
  const { id } = router.query;
  const siteId = id;

  const { data: settings } = useSWR(
    siteId && `/api/get-site-settings?siteId=${siteId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: () => {
        router.push("/");
      },
    }
  );

  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSite, setDeletingSite] = useState(false);

  const [data, setData] = useState({
    id: null,
    name: null,
    description: null,
    subdomain: null,
    customDomain: null,
  });

  useEffect(() => {
    if (settings)
      setData({
        id: settings.id,
        name: settings.name,
        description: settings.description,
        subdomain: settings.subdomain,
        customDomain: settings.customDomain,
      });
  }, [settings]);

  useEffect(() => {
    if (adding) setDisabled(true);
  }, [adding]);

  async function saveSiteSettings(data) {
    setSaving(true);
    const response = await fetch("/api/save-site-settings", {
      method: "POST",
      body: JSON.stringify({
        id: siteId,
        currentSubdomain: settings.subdomain,
        ...data,
      }),
    });
    if (response.ok) {
      setSaving(false);
      mutate(`/api/get-site-settings?siteId=${siteId}`);
      toast.success(`Changes Saved`);
    }
  }

  async function deleteSite(siteId) {
    setDeletingSite(true);
    const response = await fetch(`/api/delete-site?siteId=${siteId}`);
    if (response.ok) {
      router.push("/");
    }
  }
  const [debouncedSubdomain] = useDebounce(data?.subdomain, 1500);
  const [subdomainError, setSubdomainError] = useState(null);

  useEffect(async () => {
    if (
      debouncedSubdomain != settings?.subdomain &&
      debouncedSubdomain?.length > 0
    ) {
      const response = await fetch(
        `/api/check-subdomain?subdomain=${debouncedSubdomain}`
      );
      const available = await response.json();
      if (available) {
        setSubdomainError(null);
      } else {
        setSubdomainError(`${debouncedSubdomain}.orvylle.com`);
      }
    }
  }, [debouncedSubdomain]);

  return (
    <Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
        }}
      />
      <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-20 mb-16">
        <h1 className="font-cal text-5xl mb-12">Site Settings</h1>
        <div className="mb-28 flex flex-col space-y-12">
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Token Id</h2>
            <div className="border border-gray-700 rounded-lg overflow-hidden flex items-center max-w-lg">
              <input
                className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none placeholder-gray-400"
                type="text"
                name="name"
                placeholder="Untitled Site"
                value={data?.name}
                onInput={(e) =>
                  setData((data) => ({ ...data, name: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Site Description</h2>
            <div className="border border-gray-700 rounded-lg overflow-hidden flex items-center max-w-lg">
              <textarea
                className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none placeholder-gray-400"
                type="text"
                name="description"
                rows="3"
                placeholder="Lorem ipsum forem dimsum"
                value={data?.description}
                onInput={(e) =>
                  setData((data) => ({ ...data, description: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Contract Address</h2>
            <div className="border border-gray-700 rounded-lg flex items-center max-w-lg">
              <input
                className="w-1/2 px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
                type="text"
                name="subdomain"
                placeholder="subdomain"
                value={data.subdomain}
                onInput={(e) =>
                  setData((data) => ({ ...data, subdomain: e.target.value }))
                }
              />
              <div className="w-1/2 h-12 flex justify-center items-center font-cal rounded-r-lg border-l border-gray-600 bg-gray-100">
                orvylle.com
              </div>
            </div>
            {subdomainError && (
              <p className="px-5 text-left text-red-500">
                <b>{subdomainError}</b> is not available. Please choose another
                subdomain.
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Custom Domain</h2>
            {!data.customDomain && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const customDomain = e.target.customDomain.value;
                  setAdding(true);
                  await fetch(
                    `/api/add-domain?domain=${customDomain}&siteId=${siteId}`
                  ).then((res) => {
                    setAdding(false);
                    if (res.ok) {
                      setError(null);
                      setData((data) => ({
                        ...data,
                        customDomain: customDomain,
                      }));
                      e.target.customDomain.value = "";
                    } else {
                      setError({ code: res.status, domain: customDomain });
                    }
                  });
                }}
                className="flex justify-start items-center space-x-3 max-w-lg"
              >
                <div className="border border-gray-700 flex-auto rounded-lg overflow-hidden">
                  <input
                    className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none placeholder-gray-400"
                    type="text"
                    name="customDomain"
                    autoComplete="off"
                    placeholder="mydomain.com"
                    pattern="^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
                    onInput={(e) => {
                      const customDomain = e.target.value;
                      if (!customDomain || customDomain.length == 0) {
                        setDisabled(true);
                      } else {
                        setDisabled(false);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={disabled}
                  className={`${
                    disabled
                      ? "cursor-not-allowed bg-gray-100 text-gray-500 border-gray-300"
                      : "bg-black text-white border-black hover:text-black hover:bg-white"
                  } px-5 py-3 w-28 font-cal border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
                >
                  {adding ? <LoadingDots /> : "Add"}
                </button>
              </form>
            )}
            {error && (
              <div className="text-red-500 text-left w-full max-w-2xl mt-5 text-sm flex items-center space-x-2">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  shapeRendering="geometricPrecision"
                  style={{ color: "#f44336" }}
                >
                  <circle cx="12" cy="12" r="10" fill="white" />
                  <path d="M12 8v4" stroke="#f44336" />
                  <path d="M12 16h.01" stroke="#f44336" />
                </svg>
                {error.code == 403 ? (
                  <p>
                    <b>{error.domain}</b> is already owned by another team.
                    <button
                      className="ml-1"
                      onClick={async (e) => {
                        e.preventDefault();
                        await fetch(
                          `/api/request-delegation?domain=${error.domain}`
                        ).then((res) => {
                          if (res.ok) {
                            toast.success(
                              `Requested delegation for ${error.domain}. Try adding the domain again in a few minutes.`
                            );
                          } else {
                            alert(
                              "There was an error requesting delegation. Please try again later."
                            );
                          }
                        });
                      }}
                    >
                      <u>Click here to request access.</u>
                    </button>
                  </p>
                ) : (
                  <p>
                    Cannot add <b>{error.domain}</b> since it's already assigned
                    to another project.
                  </p>
                )}
              </div>
            )}
            {data.customDomain && <DomainCard data={data} setData={setData} />}
          </div>
          <div className="flex flex-col space-y-6 relative">
            <div className="w-full h-10" />
            <div className="flex flex-col space-y-6 max-w-lg">
              <h2 className="font-cal text-2xl">Delete Site</h2>
              <p>
                Permanently delete your site and all of its contents from our
                platform. This action is not reversible – please continue with
                caution.
              </p>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                className="bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white px-5 py-3 max-w-max font-cal border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150"
              >
                Delete Site
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await deleteSite(siteId);
          }}
          className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-lg"
        >
          <h2 className="font-cal text-2xl mb-6">Delete Site</h2>
          <div className="grid gap-y-5 w-5/6 mx-auto">
            <p className="text-gray-600 mb-3">
              Are you sure you want to delete your site? This action is not
              reversible. Type in the full name of your site (<b>{data.name}</b>
              ) to confirm.
            </p>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center overflow-hidden">
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                type="text"
                name="name"
                placeholder={data.name}
                pattern={data.name}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-10 w-full">
            <button
              type="button"
              className="w-full px-5 py-5 text-sm text-gray-400 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
              onClick={() => setShowDeleteModal(false)}
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={deletingSite}
              className={`${
                deletingSite
                  ? "cursor-not-allowed text-gray-400 bg-gray-50"
                  : "bg-white text-gray-600 hover:text-black"
              } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
            >
              {deletingSite ? <LoadingDots /> : "DELETE SITE"}
            </button>
          </div>
        </form>
      </Modal>

      <footer className="h-20 z-20 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-end items-center">
          <button
            onClick={() => {
              saveSiteSettings(data);
            }}
            disabled={saving || subdomainError}
            className={`${
              saving || subdomainError
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : "bg-black hover:bg-white hover:text-black border-black"
            } mx-2 w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
          >
            {saving ? <LoadingDots /> : "Save Changes"}
          </button>
        </div>
      </footer>
    </Layout>
  );
}
