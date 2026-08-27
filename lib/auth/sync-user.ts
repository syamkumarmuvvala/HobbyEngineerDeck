import type { User as AuthUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma/client";

function displayName(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  const name = meta.full_name ?? meta.name ?? meta.user_name;
  return typeof name === "string" && name.length > 0 ? name : null;
}

function avatarUrl(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  const url = meta.avatar_url ?? meta.picture;
  return typeof url === "string" && url.length > 0 ? url : null;
}

export async function syncUser(authUser: AuthUser) {
  if (!authUser.email) {
    throw new Error("Authenticated user is missing an email");
  }

  const email = authUser.email;
  const name = displayName(authUser);
  const picture = avatarUrl(authUser);
  const profile = {
    email,
    ...(name ? { name } : {}),
    ...(picture ? { avatarUrl: picture } : {}),
  };

  const byId = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (byId) {
    return prisma.user.update({
      where: { id: authUser.id },
      data: profile,
    });
  }

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: byEmail.id },
        data: { email: `migrated+${byEmail.id}@local.invalid` },
      });
      const created = await tx.user.create({
        data: {
          id: authUser.id,
          email,
          name: name ?? byEmail.name,
          avatarUrl: picture ?? byEmail.avatarUrl,
          role: byEmail.role,
          isMember: byEmail.isMember,
          isMentor: byEmail.isMentor,
          isAdmin: byEmail.isAdmin,
        },
      });
      await tx.blogPost.updateMany({
        where: { authorId: byEmail.id },
        data: { authorId: created.id },
      });
      await tx.user.delete({ where: { id: byEmail.id } });
      return created;
    });
  }

  return prisma.user.create({
    data: {
      id: authUser.id,
      email,
      name,
      avatarUrl: picture,
      role: "MEMBER",
      isMember: true,
      isMentor: false,
      isAdmin: false,
    },
  });
}

export { canAuthor, isMember, isAdmin } from "@/lib/auth/capabilities";
