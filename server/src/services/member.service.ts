import type { Member } from "../generated/prisma/client";
import prisma from "../lib/db";

export const memberService = {
  async createMember(data: { name: string; email: string }): Promise<Member> {
    return prisma.member.create({
      data,
    });
  },

  async getAllMembers(): Promise<Member[]> {
    return prisma.member.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getMemberById(memberId: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { id: memberId },
    });
  },

  async updateMember(
    memberId: string,
    data: { name?: string; email?: string },
  ): Promise<Member> {
    return prisma.member.update({
      where: { id: memberId },
      data,
    });
  },

  async deleteMember(memberId: string): Promise<Member> {
    return prisma.member.delete({
      where: { id: memberId },
    });
  },
};
