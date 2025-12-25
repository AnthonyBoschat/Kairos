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

interface toggleTaskFavoriteProps{
    taskID:string
}
export async function toggleTaskFavorite({taskID}: toggleTaskFavoriteProps){
    const user = await getCurrentUser()
    if(!user?.id) throw new Error("Non autorisé")

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) throw new Error("Tâche non trouvé")

    const newFavoriteState = !task.favorite
    await prisma.task.update({
        where:{id:taskID},
        data:{
            favorite:newFavoriteState
        }
    })

    revalidatePath("/dashboard")
    return {success:true, message:"Tâche ajouté aux favoris"}
}

interface deleteTaskProps{
    taskID:string
}
export async function deleteTask({taskID}: deleteTaskProps){
    const user = await getCurrentUser()
    if(!user.id) throw new Error("Non autorisé")

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) throw new Error("Tâche non trouvé")

    await prisma.task.delete({
        where:{id:taskID}
    })

    return{success:true, message:"Tâche supprimé"}
}

type updateTaskContentProps = {
    taskID:string
    content:string
}
export async function updateTaskContent({taskID, content}: updateTaskContentProps){
    const user = await getCurrentUser()
    if(!user.id) throw new Error("Non autorisé")

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) throw new Error("Tâche non trouvé")

    const nullContent = content.trim() === "" 
    await prisma.task.update({
        where:{id:taskID},
        data:{
            content:nullContent ? null : content
        }
    })

    return {success:true}
}

type updateTaskTitleProps = {
    taskID:string
    title:string
}
export async function updateTaskTitle({taskID, title}: updateTaskTitleProps){
    const user = await getCurrentUser()
    if(!user.id) throw new Error("Non autorisé")

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) throw new Error("Tâche non trouvé")

    const nullTitle = title.trim() === "" 

    await prisma.task.update({
        where:{id:taskID},
        data:{
            title:nullTitle ? task.title : title
        }
    })

    return {success:true}
}




type reorderTasksType = string[]

export async function reorderTasks(orderedTasksIds:reorderTasksType) {
    const user = await getCurrentUser()
    if (!user.id) throw new Error("Non autorisé")

    if (orderedTasksIds.length === 0) return { success: true }

    orderedTasksIds.map(async (taskID, index) =>
        await prisma.task.update({
            where: { id: taskID },
            data: { order: index },
        })
    )

    revalidatePath("/dashboard")
    return { success: true }
}