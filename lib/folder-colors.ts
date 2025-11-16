import FOLDER_COLORS from "@/constants/folderColor"
import { prisma } from "./prisma"

export async function getNextAvailableColorIndex(userId: string) {
    const folders = await prisma.folder.findMany({
        where: { 
        userId,
        defaultColor: { not: null } // Uniquement les defaultColor utilisé (Pas les customs)
        },
        select: { defaultColor: true } // On ne sélectionner que le champ defaultColor
    })
    
    //   Liste des indexs utilisés
    const usedIndexes = new Set(folders.map(folder => folder.defaultColor!))
    
    // Si une couleur non utilisé -> On le renvoie directement
    for (let i = 0; i < FOLDER_COLORS.length; i++) {
        if (!usedIndexes.has(i)) return i
    }
    
    // Sinon on compte les occurences
    const indexCounts = Array.from({ length: FOLDER_COLORS.length }, (_, i) => ({
        index: i,
        count: folders.filter(folder => folder.defaultColor === i).length
    }))
    
    // On renvoie l'index de celui qui a le moins d'occurence
    return indexCounts.sort((a, b) => a.count - b.count)[0].index
}