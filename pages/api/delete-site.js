import prisma from "@/lib/prisma";

export default async function DeleteSite(req, res) {
  const { siteId } = req.query;
  await prisma.site.delete({
    where: {
      id: siteId,
    },
  });
  res.status(200).end();
}
