"use client"
import s from "./styles.module.scss"
import Overlay from "@/components/overlay"
import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from "react"
import withClass from "@/utils/class"
import handleResponse from "@/utils/handleResponse"
import { useQueryClient } from "@tanstack/react-query"
import SuccessIcon from "@/components/ui/icons/Success"
import { useDashboardContext } from "@/context/DashboardContext"
import { ListWithTaskAndFolder } from "@/types/list"
import RichEditor from "@/components/richEditor"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"
import { updateListTemplate } from "@/app/actions/list"
import TemplateIcon from "@/components/ui/icons/Template"
import SyncIcon from "@/components/ui/icons/Sync"


interface TaskDetailProps{
    list:ListWithTaskAndFolder
    setTemplateOpen:Dispatch<SetStateAction<boolean>>
    listColor: string
    onUpdate?: (template: string | null) => void
    style?: React.CSSProperties
}


export default function ListTemplate(props:TaskDetailProps){

    const contentTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
    const contentValueRef   = useRef(props.list.template || "")

    const [isSyncData, setIsSyncData]   = useState(true)
    const [closing, setClosing] = useState(false)
    
    const queryClient           = useQueryClient()
    const {selectedFolderID}    = useDashboardContext()
    


    const handleUpdateListTemplate = (currentContent: string) => {
        handleResponse({
            request: () => updateListTemplate(props.list.id, currentContent),
            onSuccess: () => {
                
                queryClient.setQueriesData<ListWithTaskAndFolder[]>({queryKey: ['lists', selectedFolderID]}, (previousLists) => {
                    return previousLists?.map(list =>
                        list.id === props.list.id
                            ? { ...list, template: currentContent.trim() === "" ? null : currentContent }
                            : list
                    )
                })
                if(props.onUpdate){
                    props.onUpdate(currentContent.trim() === "" ? null : currentContent)
                }
            }
        })
    }

    const handleChangeTemplate = useCallback((html: string) => {
        contentValueRef.current = html
        setIsSyncData(false)

        if (contentTimerRef.current){
            clearTimeout(contentTimerRef.current)
        }
        contentTimerRef.current = setTimeout(() => {
            handleUpdateListTemplate(contentValueRef.current)
            setIsSyncData(true)
        }, 800)
    }, [])

    const cardRef = useRef(null)

    useCallbackOnClickOutside(cardRef, () => {
        setClosing(true)
        setTimeout(() => {
            props.setTemplateOpen(false)
        }, 75);
    })

    return(
        <Overlay root>
            {(isClosing) => {

                if (isClosing && !isSyncData) handleUpdateListTemplate(contentValueRef.current)
                    
                return(
                    <div style={props.style} className={withClass(s.container, closing && s.closing)}>
                        <div className={s.card} ref={cardRef}>
                            <div className={s.cardBefore} style={{ backgroundColor: props.listColor }} />
                            <div className={s.header}><TemplateIcon size={20}/> Template - <span>{props.list.title}</span></div>
                            <div className={s.content}>
                                <RichEditor
                                    value={contentValueRef.current}
                                    color={props.listColor}
                                    placeholder="Commencer à rédiger votre template"
                                    onChange={(html) => {
                                        handleChangeTemplate(html)
                                    }}
                                />
                            </div>


                            <div className={s.sync}>
                                {isSyncData && <span title="Contenu enregistré"><SuccessIcon size={16} /></span>}
                                {!isSyncData && <span title="Contenu en cours de sauvegarde"><SyncIcon size={16}/></span>}
                            </div>
                        </div>

                    </div>
                )
            }}
        </Overlay>
        
    )
}