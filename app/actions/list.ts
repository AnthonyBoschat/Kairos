'use server'

import { getCurrentUser } from "@/lib/auth";
import { getNextAvailableListColorIndexForThisFolder } from "@/lib/list-color";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const checkUser = async() => {
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")
}

const checkListExist = async(listID:string) => {
    const list = await prisma.list.findUnique({
        where:{id:listID}
    })
    if(!list) throw new Error("La liste que vous essayez de modifier n'existe pas")
}

export async function getNextFolderColorIndexForThisFolder(folderID:string){
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Non autorisé");
    const colorIndex = await getNextAvailableListColorIndexForThisFolder(folderID);
    return colorIndex;
}

export async function getLists(id:string){
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Non autorisé");

    const lists = await prisma.list.findMany({
        where:{folderId:id},
        include:{
            folder:{
                select:{
                    title: true
                }
            },
            tasks:true
        }
    })
    
    return {success:true, lists:lists}
}

export async function deleteList(id:string){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")

    const list = await prisma.list.findUnique({
        where:{id}}
    )

    if(!list) throw new Error("La liste que vous essayez de supprimer n'existe pas")

    const deletedList = await prisma.list.delete({
        where:{id:id}
    })

    revalidatePath("/dashboard")
    return {success:true, message:`La liste ${deletedList.title} a été supprimer avec succès`}
}

export async function addList({title, folderID}:{title:string, folderID:string}) {
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")
    

    const folder = await prisma.folder.findFirst({
        where: { id: folderID, userId: user.id }
    })
    if (!folder) throw new Error("Dossier non trouvé")

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
        }
    })

    revalidatePath('/dashboard')
    return {success:true, message:`La liste ${createdList.title} a été ajouter`}
}

export async function toggleListFavorite(listID: string){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")

    const list = await prisma.list.findUnique({
        where:{id:listID}
    })

    if(!list) throw new Error("La liste que vous essayez de modifier n'existe pas")

    const newFavoriteState = !list.favorite
    await prisma.list.update({
        where:{id:listID},
        data:{
            favorite:newFavoriteState
        }
    }) 

    const message = newFavoriteState ? "Liste ajouter aux favoris" : "Liste retirer des favoris"
    revalidatePath("/dashboard")
    return {success:true, message:message}
}

export async function updateList({
    listID, 
    title, 
    countElement
}:{
    listID:string|undefined, 
    title:string|undefined,
    countElement:boolean|undefined,
}){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")

    const list = await prisma.list.findUnique({
        where:{id:listID}
    })

    if(!list) throw new Error("La liste que vous essayez de modifier n'existe pas")

    await prisma.list.update({
        where:{id:listID},
        data:{
            title:title,
            countElement:countElement
        }
    })

    revalidatePath("/dashboard")
    return {success:true, message:`La liste a été correctement modifier`}
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

    revalidatePath("/dashboard")
    const message = "Couleur da la liste modifier avec succès"
    return {success:true, message:message}
}


type reorderListsType = string[]

export async function reorderLists(orderedListsIds:reorderListsType) {
    const user = await getCurrentUser()
    if (!user.id) throw new Error("Non autorisé")

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