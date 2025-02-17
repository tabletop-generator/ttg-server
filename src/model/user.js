const { createPresignedUrl } = require("./data/aws");
const prisma = require("./data/prismaClient");

async function getUser(hashedEmail) {
  // Get user from database
  let user = await prisma.user.findUniqueOrThrow({
    where: {
      hashedEmail: hashedEmail,
    },
    include: {
      assets: true,
      collections: true,
      comments: true,
    },
  });

  // If the user doesn't have a profile picture we don't need to check if the url is expired
  if (!(user.profilePictureUrl && user.profilePictureUrlExpiry)) {
    return user;
  }

  // If profile picture url is expired or about to expire soon, create and save new url before returning
  // Define a buffer time in milliseconds
  const BUFFER_WINDOW = 2 * 60 * 1000;
  const currentTime = new Date().getTime();

  if (user.profilePictureUrlExpiry.getTime() <= currentTime + BUFFER_WINDOW) {
    const key = user.id;
    const { url, urlExpiry } = await createPresignedUrl(key);

    user = prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profilePictureUrl: url,
        profilePictureUrlExpiry: urlExpiry,
      },
      include: {
        assets: true,
        collections: true,
        comments: true,
      },
    });
  }

  return user;
}

module.exports.get = getUser;
