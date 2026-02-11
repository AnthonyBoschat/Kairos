import { prisma } from "@/lib/prisma"


import { TrashFilter } from "@/types/trashFilter"

type TrashTarget = "folder" | "list" | "task"

export function withTrash(filter: TrashFilter, target?: TrashTarget) {
  switch (filter) {
    case "no":
      return { deletedAt: null }

    case "yes":
      return {}

    case "only":
      if (target === "folder") {
        return {
          OR: [
            { deletedAt: { not: null } },
            { lists: { some: { deletedAt: { not: null } } } },
            { lists: { some: { tasks: { some: { deletedAt: { not: null } } } } } }
          ]
        }
      }
      if (target === "list") {
        return {
          OR: [
            { deletedAt: { not: null } },
            { tasks: { some: { deletedAt: { not: null } } } }
          ]
        }
      }
      // task ou défaut
      return { deletedAt: { not: null } }
  }
}

// Restauration d'un élément softDelete
export async function restore(model: "folder" | "list" | "task", id:string){
    return (prisma[model] as any).update({
        where: {id},
        data: {deletedAt:null}
    })
}

// Suppression définitive d'un élément softDelete
export async function hardDelete(model: "folder" | "list" | "task", id:string){
    return prisma.$executeRaw`DELETE FROM ${model} WHERE id = ${id}`
}