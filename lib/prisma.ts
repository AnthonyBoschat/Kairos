import { PrismaClient } from '@prisma/client';

const basePrisma = new PrismaClient();

function softDeleteExtension(model: 'folder' | 'list' | 'task') {
  return {
    async findMany({ args, query }: any) {
      return query(args);
    },
    async delete({ args }: any) {
      const now = new Date();

      if (model === 'folder') {
        // Soft delete les tasks des listes du dossier
        const lists = await basePrisma.list.findMany({
          where: { folderId: args.where.id, deletedAt: null },
          select: { id: true },
        });
        const listIds = lists.map((l: any) => l.id);

        if (listIds.length > 0) {
          await basePrisma.task.updateMany({
            where: { listId: { in: listIds }, deletedAt: null },
            data: { deletedAt: now },
          });
          await basePrisma.list.updateMany({
            where: { id: { in: listIds } },
            data: { deletedAt: now },
          });
        }
      }

      if (model === 'list') {
        await basePrisma.task.updateMany({
          where: { listId: args.where.id, deletedAt: null },
          data: { deletedAt: now },
        });
      }

      return (basePrisma[model] as any).update({
        where: args.where,
        data: { deletedAt: now },
      });
    },
    async update({ args, query }: any) {
      if (args.data?.deletedAt === null) {

        // Cascade vers le BAS (enfants) — comme avant
        if (model === 'folder') {
          const lists = await basePrisma.list.findMany({
            where: { folderId: args.where.id, deletedAt: { not: null } },
            select: { id: true },
          });
          const listIds = lists.map((l: any) => l.id);
          if (listIds.length > 0) {
            await basePrisma.task.updateMany({
              where: { listId: { in: listIds }, deletedAt: { not: null } },
              data: { deletedAt: null },
            });
            await basePrisma.list.updateMany({
              where: { id: { in: listIds } },
              data: { deletedAt: null },
            });
          }
        }

        if (model === 'list') {
          // Cascade bas : restaurer les tasks de cette list
          await basePrisma.task.updateMany({
            where: { listId: args.where.id, deletedAt: { not: null } },
            data: { deletedAt: null },
          });

          // Cascade haut : restaurer le folder parent SANS cascade
          const list = await basePrisma.list.findUnique({
            where: { id: args.where.id },
            select: { folderId: true },
          });
          if (list?.folderId) {
            await basePrisma.folder.update({
              where: { id: list.folderId },
              data: { deletedAt: null },
            });
          }
        }

        if (model === 'task') {
          // Cascade haut : restaurer la list parent SANS cascade
          const task = await basePrisma.task.findUnique({
            where: { id: args.where.id },
            select: { listId: true },
          });
          if (task?.listId) {
            // Restaurer la list sans cascade (basePrisma)
            const list = await basePrisma.list.findUnique({
              where: { id: task.listId },
              select: { folderId: true, deletedAt: true },
            });
            if (list?.deletedAt) {
              await basePrisma.list.update({
                where: { id: task.listId },
                data: { deletedAt: null },
              });
            }
            // Restaurer le folder sans cascade (basePrisma)
            if (list?.folderId) {
              await basePrisma.folder.update({
                where: { id: list.folderId },
                data: { deletedAt: null },
              });
            }
          }
        }
      }

      return query(args);
    },
    async deleteMany({ args }: any) {
      return (basePrisma[model] as any).updateMany({
        where: args.where,
        data: { deletedAt: new Date() },
      });
    },
  };
}

function createPrismaClient() {
  return basePrisma.$extends({
    query: {
      folder: softDeleteExtension('folder'),
      list:   softDeleteExtension('list'),
      task:   softDeleteExtension('task'),
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;