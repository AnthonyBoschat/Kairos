'use server'

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const checkUser = async () => {
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")
    return user
}

export async function search(searchValue: string) {
    const user = await checkUser()

    const folders = await prisma.folder.findMany({
        where: {
            userId: user.id,
            title: { contains: searchValue, mode: "insensitive" }
        },
        select: { 
            id: true, 
            title: true 
        }
    })

    const lists = await prisma.list.findMany({
        where: {
            folder: { userId: user.id },
            title: { contains: searchValue, mode: "insensitive" }
        },
        select: { 
            id: true, 
            title: true, 
            folder: { 
                select: { 
                    id: true, 
                    title: true 
                } 
            } 
        }
    })

    const tasks = await prisma.task.findMany({
        where: {
            list: { folder: { userId: user.id } },
            title: { contains: searchValue, mode: 'insensitive' }
        },
        select: {
            id: true,
            title: true,
            list: { 
                select: { 
                    id: true, 
                    title: true, 
                    folder: { 
                        select: { 
                            id: true, 
                            title: true 
                        } 
                    } 
                } 
            }
        }
    })

    return {
        success: true,
        folders,
        lists: lists.map(l => ({
            id: l.id,
            title: l.title,
            folderId: l.folder.id,
            folderTitle: l.folder.title
        })),
        tasks: tasks.map(t => ({
            id: t.id,
            title: t.title,
            listId: t.list.id,
            listTitle: t.list.title,
            folderId: t.list.folder.id,
            folderTitle: t.list.folder.title
        }))
    }
}