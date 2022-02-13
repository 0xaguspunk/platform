import prisma from "@/lib/prisma";
import cuid from "cuid";

export default async function CreateSite(req, res) {
  const { name, subdomain, description, userId, contractAddress, imageUrl } = req.body;
  const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

  const response = await prisma.site.create({
    data: {
      name: name,
      description: description,
      subdomain: sub.length > 0 ? sub : cuid(),
      contract: contractAddress,
      logoUrl: "/logo.png",
      imageUrl: imageUrl,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  res.status(200).json({ siteId: response.id });
}
