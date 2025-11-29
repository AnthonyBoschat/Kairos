'use server'

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
            }
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
            defaultColor: 0, // TODO - Faire la fonction pour récupérer la prochaine couleur logique
            order: (maxOrder._max.order ?? -1) + 1,
            folderId: folder.id
        }
    })

    revalidatePath('/dashboard')
    return {success:true, message:`La liste ${createdList.title} a été ajouter`}
}

export async function togglerListFavorite(listID: string){
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