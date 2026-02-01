'use server'


import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import checkUser from "./utils"
import logHistory from "./historic"
import { HistoricItemType } from "@prisma/client"

interface addTaskProps{
    title: string
    listID: string
}

export async function addTask({title, listID}: addTaskProps){
    const user = await checkUser()

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
    await logHistory(createdTask, HistoricItemType.TASK)

    revalidatePath("/dashboard")
    return {success:true, message:"Tâche ajouter", task:createdTask}
}

interface toggleTaskFavoriteProps{
    taskID:string
}
export async function toggleTaskFavorite({taskID}: toggleTaskFavoriteProps){
    await checkUser()

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
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) throw new Error("Tâche non trouvé")

    const deletedTask = await prisma.task.delete({
        where:{id:taskID}
    })

    await logHistory(deletedTask, HistoricItemType.TASK, true)
    return{success:true, message:"Tâche supprimé"}
}

type updateTaskContentProps = {
    taskID:string
    content:string
}
export async function updateTaskContent({taskID, content}: updateTaskContentProps){
    await checkUser()

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
    await checkUser()

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

type toggleTaskDoneProps = {
    taskID:string
}
export async function toggleTaskDone({taskID}: toggleTaskDoneProps){
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) throw new Error("Tâche non trouvé")

    const currentTaskDone = task.done

    await prisma.task.update({
        where:{id:taskID},
        data:{
            done:!currentTaskDone
        }
    })
    
    return {success:true}
}




type reorderTasksType = string[]

export async function reorderTasks(orderedTasksIds:reorderTasksType) {
    await checkUser()

    if (orderedTasksIds.length === 0) return { success: true }
    const totalTasksCount = orderedTasksIds.length

    await Promise.all(
        orderedTasksIds.map((taskID, index) =>
            prisma.task.update({
                where: { id: taskID },
                data: { order: totalTasksCount - 1 - index },
            })
        )
    )

    revalidatePath("/dashboard")
    return { success: true }
}