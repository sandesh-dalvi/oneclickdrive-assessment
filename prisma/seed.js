const { PrismaClient } = require("@prisma/client");
const listings = require("./mock-data.json");
const prisma = new PrismaClient();

async function main() {
  for (const listing of listings) {
    await prisma.listing.create({
      data: listing,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect;
    process.exit(1);
  });
