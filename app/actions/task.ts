'use server'


import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface addTaskProps{
    title: string
    listID: string
}

export async function addTask({title, listID}: addTaskProps){
    const user = await getCurrentUser()
    if(!user?.id) throw new Error("Non autorisé")

    const list = await prisma.list.findUnique({
        where:{
            id:listID,
        },
        include:{
            folder:true
        }
    })

    if(!list) throw new Error("Liste non trouvé")
    if(list.folder.userId !== user.id) throw new Error("Non autorisé, cette liste ne vous appartient pas")

    const maxOrder = await prisma.task.aggregate({
        where:{listId: list.id},
        _max:{order:true}
    })

    const createdTask = await prisma.task.create({
        data:{
            listId:list.id,
            title:title,
            order: (maxOrder._max.order ?? -1) + 1
        }
    })

    revalidatePath("/dashboard")
    return {success:true, message:"Tâche ajouter"}
}