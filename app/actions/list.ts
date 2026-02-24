'use server'

import { getCurrentUser } from "@/lib/auth";
import { getNextAvailableListColorIndexForThisFolder } from "@/lib/list-color";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import checkUser from "./utils";
import { withTrash } from "@/utils/trash";
import { TrashFilter } from "@/types/trashFilter";
import { responseError } from "@/utils/responseError";



const checkListExist = async(listID:string) => {
    const list = await prisma.list.findUnique({
        where:{id:listID}
    })
    if(!list) return responseError("La liste que vous essayez de modifier n'existe pas")
}

export async function getNextFolderColorIndexForThisFolder(folderID:string){
    await checkUser()
    const colorIndex = await getNextAvailableListColorIndexForThisFolder(folderID);
    return colorIndex;
}

export async function getLists(id:string, trashFilter: TrashFilter = "no"){
    await checkUser()
    
    const lists = await prisma.list.findMany({
        where:{
            folderId:id, 
            ...withTrash(trashFilter, "list")
        },
        include:{
            folder:{
                select:{
                    title: true
                }
            },
            tasks: {
                where: withTrash(trashFilter, "task"),
            },
        }
    })
    
    return {success:true, lists:lists}
}

export type deleteListResponse = Awaited<ReturnType<typeof deleteList>>;
export async function deleteList(id:string){
    await checkUser()

    const list = await prisma.list.findUnique({
        where:{id}}
    )

    if(!list) return responseError("La liste que vous essayez de supprimer n'existe pas")

    const deletedList = await prisma.list.delete({
        where:{id:id}
    })

    return {success:true, deletedAt:deletedList.deletedAt}
}

export type addListResponse = Awaited<ReturnType<typeof addList>>;
export async function addList({title, folderID}:{title:string, folderID:string}) {
    const user = await checkUser()
    

    const folder = await prisma.folder.findFirst({
        where: { id: folderID, userId: user.id }
    })
    if (!folder) return responseError("Dossier non trouvé")

    const maxOrder = await prisma.list.aggregate({
        where: { folderId: folder.id },
        _max: { order: true }
    })

    const createdList = await prisma.list.create({
        data: {
            title,
            color: await getNextFolderColorIndexForThisFolder(folder.id),
            order: (maxOrder._max.order ?? -1) + 1,
            folderId: folder.id
        },
        include: {
            folder: { select: { title: true } },
            tasks: true
        }
    })

    return {success:true, newList:createdList}
}

export async function toggleListFavorite(listID: string){
    await checkUser()

    const list = await prisma.list.findUnique({
        where:{id:listID}
    })

    if(!list) return responseError("La liste que vous essayez de modifier n'existe pas")

    const newFavoriteState = !list.favorite
    await prisma.list.update({
        where:{id:listID},
        data:{
            favorite:newFavoriteState
        }
    }) 

    return {success:true}
}

export async function toggleListCheckable(listID: string){
    await checkUser()

    const list = await prisma.list.findUnique({
        where:{id:listID}
    })

    if(!list) return responseError("La liste que vous essayez de modifier n'existe pas")

    const newCheckableState = !list.checkable
    await prisma.list.update({
        where:{id:listID},
        data:{
            checkable:newCheckableState
        }
    }) 

    return {success:true}
}

export async function updateList({
    listID, 
    title, 
    countElement,
    // checkable
}:{
    listID:string|undefined, 
    title:string|undefined,
    countElement:boolean|undefined,
}){
    await checkUser()

    const list = await prisma.list.findUnique({
        where:{id:listID}
    })

    if(!list) return responseError("La liste que vous essayez de modifier n'existe pas")

    const updatedList = await prisma.list.update({
        where:{id:listID},
        data:{
            title:title,
            countElement:countElement,
            // checkable: checkable
        }
    })

    return {success:true}
}

export async function updateListColor(listID:string, colorIndex:number){

    await checkUser()
    await checkListExist(listID)

    await prisma.list.update({
        where:{id:listID},
        data:{
            color:colorIndex
        }
    })

    return {success:true}
}


type reorderListsType = string[]

export async function reorderLists(orderedListsIds:reorderListsType) {
    const user = await getCurrentUser()
    if (!user.id) return responseError("Non autorisé")

    if (orderedListsIds.length === 0) return { success: true }

    await Promise.all(
        orderedListsIds.map(async (listID, index) =>
            await prisma.list.update({
                where: { id: listID },
                data: { order: index },
            })
        )
    )

    revalidatePath("/dashboard")
    return { success: true }
}


export async function restoreList(listID:string){
    await checkUser()

    const folder = await prisma.list.findUnique({
        where:{
            id:listID,
            deletedAt: {not: null}
        }
    })

    if(!folder) return responseError("La liste que vous essayez de restaurer n'existe pas")

    await prisma.list.update({
        where:{id:listID},
        data:{
            deletedAt: null
        }
    })

    return {success:true}
}