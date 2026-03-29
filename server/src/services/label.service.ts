import type { CardLabel, Label } from "../generated/prisma/client";
import type { CardLabelGetPayload } from "../generated/prisma/models";
import prisma from "../lib/db";

const labelService = {
  async createLabel({
    name,
    color,
  }: {
    name: string;
    color: string;
  }): Promise<Label> {
    return prisma.label.create({
      data: {
        name,
        color,
      },
    });
  },
  async getAllLabels(): Promise<Label[]> {
    return prisma.label.findMany({
      orderBy: { name: "asc" },
    });
  },
  async getLabelsByCard(cardId: string): Promise<
    CardLabelGetPayload<{
      include: {
        label: true;
      };
    }>[]
  > {
    return prisma.cardLabel.findMany({
      where: {
        cardId,
      },
      include: {
        label: true,
      },
    });
  },
  async updateLabel(
    labelId: string,
    {
      name,
      color,
    }: {
      name?: string;
      color?: string;
    },
  ): Promise<Label> {
    return prisma.label.update({
      where: { id: labelId },
      data: {
        name,
        color,
      },
    });
  },
  async deleteLabel(labelId: string): Promise<Label> {
    return prisma.label.delete({
      where: { id: labelId },
    });
  },
};

export default labelService;
