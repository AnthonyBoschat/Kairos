import FOLDER_COLORS from "@/constants/folderColor"
import { prisma } from "./prisma"

const DEFAULT_COLORS_COUNT = 11

export async function getNextAvailableFolderColorIndex(userId: string) {
    const folders = await prisma.folder.findMany({
        where: { 
            userId
        },
        select: { color: true }
    })
    
    const usedIndexes = new Set(folders.map(folder => folder.color!))
    
    for (let i = 0; i < DEFAULT_COLORS_COUNT; i++) {
        if (!usedIndexes.has(i)) return i
    }
    
    const indexCounts = Array.from({ length: DEFAULT_COLORS_COUNT }, (_, i) => ({
        index: i,
        count: folders.filter(folder => folder.color === i).length
    }))
    
    return indexCounts.sort((a, b) => a.count - b.count)[0].index
}