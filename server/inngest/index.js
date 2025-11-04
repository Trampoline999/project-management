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
        name: data.name,
        email: data?.emailAddresses[0].emailAddress,
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
        id: data.id,
      },
    });
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "update-user-with-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data?.emailAddresses[0].emailAddress,
        image: data?.image_url,
      },
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreate, syncUserUpdate, syncUserDelete];
