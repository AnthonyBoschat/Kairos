import { prisma } from "./prisma"
import LIST_COLOR from "@/constants/listColor"

export async function getNextAvailableListColorIndex(userId: string) {
    const lists = await prisma.list.findMany({
        where: { 
            folder:{
                userId:userId
            },
            defaultColor: { not: null } // Uniquement les defaultColor utilisé (Pas les customs)
        },
        select: { defaultColor: true } // On ne sélectionner que le champ defaultColor
    })
    
    //   Liste des indexs utilisés
    const usedIndexes = new Set(lists.map(list => list.defaultColor!))
    
    // Si une couleur non utilisé -> On le renvoie directement
    for (let i = 0; i < LIST_COLOR.length; i++) {
        if (!usedIndexes.has(i)) return i
    }
    
    // Sinon on compte les occurences
    const indexCounts = Array.from({ length: LIST_COLOR.length }, (_, i) => ({
        index: i,
        count: lists.filter(list => list.defaultColor === i).length
    }))
    
    // On renvoie l'index de celui qui a le moins d'occurence
    return indexCounts.sort((a, b) => a.count - b.count)[0].index
}