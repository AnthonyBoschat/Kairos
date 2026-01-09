import Highlight from "@/components/highlight"
import { useDashboardContext } from "@/context/DashboardContext"
import { HistoryEntry } from "@/types/history"
import { useMemo } from "react"

const BlueText  = ({children}: {children: React.ReactNode}) => <span style={{fontWeight:700}}>{children}</span>
const RedText   = ({children}: {children: React.ReactNode}) => <span style={{color:"rgba(166, 46, 46, 1)"}}>{children}</span>
const GreenText = ({children}: {children: React.ReactNode}) => <span style={{color:"rgba(64, 166, 46, 1)"}}>{children}</span>
const OldText   = ({children}: {children: React.ReactNode}) => <span style={{opacity:0.5, color:"rgba(166, 46, 46, 1)"}}>{children}</span>

export default function messageBuilder(key:string, record:HistoryEntry){

    if(record.action !== "modified"){

        if (key === "folder_created") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été <GreenText>ajouté</GreenText></span>
        }
        else if (key === "folder_deleted") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été <RedText>supprimé</RedText></span>
        }
        else if (key === "list_created") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été <GreenText>ajouté</GreenText></span>
        }
        else if (key === "list_deleted") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été <RedText>supprimé</RedText></span>
        }
        else if (key === "task_created") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été <GreenText>ajouté</GreenText></span>
        }
        else if (key === "task_deleted") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été <RedText>supprimé</RedText></span>
        }

    }

    else if(record.action === "modified"){

        if (key === "folder_modified_title") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été renommé : <OldText>{record.from as string}</OldText> → <BlueText>{record.to as string}</BlueText></span>
        }
        else if (key === "folder_modified_showprogression") {
            if(record.to)   return <span><BlueText>{record.item.title as string}</BlueText> <GreenText>affiche</GreenText> maintenant sa progression </span>
            if(!record.to)  return <span><BlueText>{record.item.title as string}</BlueText> <RedText>n'affiche plus</RedText> sa progression</span>
        }
        else if (key === "list_modified_title") {
            return <span><BlueText>{record.item.title as string}</BlueText> a été renommé : <OldText>{record.from as string}</OldText> → <BlueText>{record.to as string}</BlueText></span>
        }
    }


    return "Non défini"
}

