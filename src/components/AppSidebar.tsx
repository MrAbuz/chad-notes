import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
//import { Note } from "@prisma/client";
import { getUser } from "@/auth/server";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
import type { Prisma } from "@prisma/client";

async function AppSidebar() {
  type Note = Prisma.NoteGetPayload<{
    select: {
      id: true;
      text: true;
      createdAt: true;
      updatedAt: true;
      authorId: true;
    };
  }>;

  const user = await getUser();

  let notes: Note[] = [];

  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mt-2 mb-2 text-lg">
            Your Notes
          </SidebarGroupLabel>
          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
