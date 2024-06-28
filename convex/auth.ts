import { Auth } from 'convex/server';
import { Id } from './_generated/dataModel';

export async function getViewierId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    return null;
  }

  return identity.subject as Id<'users'>;
}

export async function handleUserId(ctx: { auth: Auth }) {
  const viewierId = await getViewierId(ctx);

  if (viewierId === null) {
    return null;
  }

  return viewierId;
}
