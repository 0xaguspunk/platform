import prisma from "@/lib/prisma";

export default async function SaveSiteSettings(req, res) {
  const data = JSON.parse(req.body);
  const subdomain = data.subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");
  const { contract, imageUrl } = data;
  const response = await prisma.site.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      contract: contract,
      imageUrl: imageUrl,
      description: data.description,
      subdomain: subdomain.length > 0 ? subdomain : data.currentSubdomain,
    },
  });

  res.status(200).json(response);
}
