import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Connect the client
  await prisma.$connect();
  // ... our Prisma client queries would go here.
  // READ
  await readUsers();

  // CREATE
  // await createUser();

  // UPDATE
  // await updateUser();

  // DELETE
  // await deleteComment();
}

async function readUsers() {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

async function createUser() {
  await prisma.user.create({
    data: {
      name: 'Deepinder',
      email: 'hello@deepinder.me',
      posts: {
        create: {
          title: 'My first post',
          body: 'Interesting blog stuff',
          slug: 'my-first-post',
        },
      },
    },
  });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.dir(allUsers, { depth: null });
}

async function updateUser() {
  await prisma.post.update({
    where: {
      slug: 'my-first-post',
    },
    data: {
      comments: {
        createMany: {
          data: [
            { comment: "Amazing post!" },
            { comment: "Can't wait to read more of these!" },
          ],
        },
      },
    },
  });

  const posts = await prisma.post.findMany({
    include: {
      comments: true,
    },
  });
  console.dir(posts, { depth: Infinity });
}

async function deleteComment() {
  await prisma.comment.delete({
    where: {
      id: "63b3fdd797879fac42a03b76",
    },
  });
  const comments = await prisma.comment.findMany();
  console.log(comments);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
