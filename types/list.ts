import { Prisma } from "@prisma/client"

export type ListWithTaskAndFolder = Prisma.ListGetPayload<{
    include: {
        folder: {
            select: {
                title: true
            }
        },
        tasks: true
    }
}>