import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import Overlay from "@/components/overlay"
import handleResponse from "@/utils/handleResponse"
import { addList } from "@/app/actions/list"
import { useQueryClient } from "@tanstack/react-query"
import AddListIcon from "@/components/ui/icons/addList"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"
import { useDashboardContext } from "@/context/DashboardContext"
import { addTask } from "@/app/actions/task"
import { Task } from "@prisma/client"
import Select from "@/components/select"
import { updateFolder } from "@/app/actions/folder"
import { usePathname, useRouter } from "next/navigation"
import ListInlineAction from "../ListInlineAction"
import { ListWithTaskAndFolder } from "@/types/list"
import DeleteIcon from "@/components/ui/icons/delete"


export default function ListsActions(){

    const {
        selectedFolderID,
        standaloneListID,
        setOrderedTasks,
        lists,
        user
    } = useDashboardContext()

    const folderDetailURL       = `/dashboard/${selectedFolderID}`
    const queryClient           = useQueryClient()
    const router                = useRouter()
    
    const formRef               = useRef<null|HTMLFormElement>(null)
    const inputRef              = useRef<null|HTMLInputElement>(null)

    const [isAdding, setIsAdding]               = useState(false)
    const [newTitle, setNewTitle]               = useState("")
    const [selectedOption, setSelectedOption]   = useState(standaloneListID)
    const [standaloneList, setStandaloneList]   = useState<null|ListWithTaskAndFolder>(null)


    const isStandaloneView      = standaloneListID !== null

    const standaloneListOptions = [
        { label: "Toute les listes", value: null },
        ...(lists?.map(list => ({ label: list.title, value: list.id })) ?? [])
    ]

    const addLabel = useMemo(() => standaloneListID ? "Ajouter un élément" : "Ajouter une liste", [standaloneListID])

    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";

    const resetNewList = () => {
        setNewTitle("")
        setIsAdding(false)
    }
    
    const handleClickAddList = () => {
        setIsAdding(true)
    }

    const handleSelectStandaloneList = (newValue:string|null) => {
        handleResponse(async() => {
            if(selectedFolderID){
                await updateFolder({
                    folderID:selectedFolderID,
                    listStandaloneID:newValue ?? null,
                })
                if(standaloneListID !== newValue){
                    const option = newValue ? `?standaloneID=${newValue}` : ""
                    router.push(`${folderDetailURL}${option}`)
                }
                setSelectedOption(newValue)
                queryClient.invalidateQueries({ queryKey: ['folders', user.id] })
            }
        })
    }

    
    const handleAdd = useCallback((title:string, KeyboardEvent?:React.KeyboardEvent) => {
        if(KeyboardEvent) KeyboardEvent.preventDefault()
        if(title.trim()){
            handleResponse(async() => {
                if(selectedFolderID){
                    if(standaloneListID && setOrderedTasks){
                        const result = await addTask({title: title, listID: standaloneListID})
                        const task: Task = result.task
                        setOrderedTasks(current => current ? [task, ...current] : [task])
                    }else{
                        await addList({title:title, folderID:selectedFolderID})
                    }

                    setNewTitle("")
                    queryClient.invalidateQueries({ queryKey: ['lists', selectedFolderID] })
                }
            })
        }
        if(KeyboardEvent){
            setIsAdding(true)
            setNewTitle("")
        }else{
            setIsAdding(false)
        }
    }, [standaloneListID])

    // Si on est plus dans une vue liste unique, on reset le selecteur à sa valeur par défaut (toute les listes)
    useEffect(() => {
        if(!standaloneListID){
            setSelectedOption(null)
        }
    }, [standaloneListID])

    useEffect(() => {
        if(isStandaloneView && lists){
            const list = lists.find(list => list.id === standaloneListID)
            setStandaloneList(list ?? null)
        }
    }, [isStandaloneView, standaloneListID, lists])

    useEffect(() => {
        if(inputRef.current){
            if(isAdding) inputRef.current.focus()
            else inputRef.current.blur()
        }
    }, [isAdding, inputRef])

    useCallbackOnClickOutside(formRef, resetNewList)



    return(
        <div className={s.container}>
            <div className={s.buttonContainer}>
                <button title={`Ouvrir le formulaire pour ajouter ${standaloneListID ? "un nouvel élément à la liste" : "une nouvelle liste au dossier"}`} onClick={handleClickAddList} className={withClass(s.add, isAdding && s.active)}>
                    {addLabel}
                </button>
                {isAdding && (
                    <Overlay onClose={() => setIsAdding(false)}>
                        {(isClosing) => (
                            <form ref={formRef} className={withClass(s.addListForm, isClosing && s.closing)}>
                                <input ref={inputRef} onKeyDown={(e) => isEnter(e) && handleAdd(newTitle, e)} onChange={(e) => setNewTitle(e.currentTarget.value)} type="text" value={newTitle} />
                                <button title={`Ajouter ${standaloneListID ? "un nouvel élément à la liste" : "une nouvelle liste au dossier"}`} onClick={() => handleAdd(newTitle)}>
                                    <AddListIcon/>
                                </button>
                            </form>
                        )}
                    </Overlay>
                )}
            </div>

            <div className={s.options}>
                <div className={withClass(s.selectList)}>
                    <Select
                        styles={{ height:"2.5rem"}}
                        options={standaloneListOptions}
                        value={selectedOption}
                        onClick={(value:any) => handleSelectStandaloneList(value)}
                    />
                </div>
                {(standaloneList && isStandaloneView) && (
                    <div className={s.actions}>
                        <ListInlineAction list={standaloneList}/>
                    </div>
                )}
            </div>
        </div>
    )
}