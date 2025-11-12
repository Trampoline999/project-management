import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management-app" });

//creating user Auth functions

const syncUserCreate = inngest.createFunction(
  { id: "create-user-with-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data?.id,
        email: data?.email_addresses[0].email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

const syncUserDelete = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: {
        id: data?.id,
      },
    });
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "update-user-with-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: {
        id: data?.id,
      },
      data: {
        email: data?.email_addresses[0].email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

const syncWorkspaceCreate = inngest.createFunction(
  { id: "create-workspace-with-clerk" },
  { event: "clerk/organization.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data?.id,
        name: data?.name,
        slug: data?.slug,
        ownerId: data?.created_by,
        image_url: data?.image_url,
      },
    });

    // Add creator as ADMIN....
    await prisma.workspaceMember.create({
      data: {
        userId: data?.created_by,
        workspaceId: data?.Id,
        Role: "ADMIN",
      },
    });
  }
);

const syncWorkspaceUpdate = inngest.createFunction(
  { id: "update-workspace-with-clerk" },
  { event: "clerk/organization.updated" },

  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: {
        id: data?.id,
      },
      data: {
        name: data?.name,
        slug: data?.slug,
        image_url: data?.image_url,
      },
    });
  }
);

const syncUserworkspaceDelete = inngest.createFunction(
  { id: "delete-workspace-with-clerk" },
  { event: "clerk/organization.deleted" },

  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.delete({
      where: {
        id: data?.id,
      },
    });
  }
);

//   workspace members Invitation.....
const syncWorkspaceMemberInvitation = inngest.createFunction(
  { id: "create-workspace-member-with-clerk" },
  { event: "clerk/organizationInvitation.accepted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspaceMember.create({
      data: {
        userId: data?.userId,
        workspaceId: data?.workspaceId,
        role: data?.String(data?.role).toUpperCase(),
      },
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreate,
  syncUserUpdate,
  syncUserDelete,
  syncWorkspaceCreate,
  syncWorkspaceUpdate,
  syncUserworkspaceDelete,
  syncWorkspaceMemberInvitation,
];
