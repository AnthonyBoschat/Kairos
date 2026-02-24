import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import Overlay from "@/components/overlay"
import handleResponse from "@/utils/handleResponse"
import { addList, addListResponse } from "@/app/actions/list"
import { useQueryClient } from "@tanstack/react-query"
import AddListIcon from "@/components/ui/icons/addList"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"
import { useDashboardContext } from "@/context/DashboardContext"
import { addTask, addTaskResponse } from "@/app/actions/task"
import Select from "@/components/select"
import { updateFolder } from "@/app/actions/folder"
import { useRouter } from "next/navigation"
import ListInlineAction from "../ListInlineAction"
import { FolderWithList, ListWithTaskAndFolder } from "@/types/list"


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
        if(selectedFolderID){
            handleResponse({
                request: () => updateFolder({
                    folderID:selectedFolderID,
                    listStandaloneID:newValue ?? null,
                }),
                onSuccess: async() => {
                    queryClient.setQueriesData<FolderWithList[]>({queryKey:['folders', user.id]}, (previousFolders) => {
                        if(!previousFolders) return previousFolders
                        return previousFolders.map(folder => folder.id === selectedFolderID ? {...folder, listStandaloneID:newValue ?? null} : folder)
                    })
                    if(standaloneListID !== newValue){
                        const option = newValue ? `?standaloneID=${newValue}` : ""
                        router.push(`${folderDetailURL}${option}`)
                    }
                    setSelectedOption(newValue)
                }
            })

        }
    }

    
    const handleAdd = useCallback((title:string, KeyboardEvent?:React.KeyboardEvent) => {
        if(KeyboardEvent) KeyboardEvent.preventDefault()
        if(title.trim()){
            if(selectedFolderID){
                if(standaloneListID && setOrderedTasks){
                    handleResponse({
                        request: () => addTask({title: title, listID: standaloneListID}),
                        onSuccess: (response: addTaskResponse) => {
                            if(response.success){
                                setOrderedTasks(current => current ? [response.task, ...current] : [response.task])
                                setNewTitle("")
                                queryClient.setQueriesData<ListWithTaskAndFolder[]>({queryKey:['lists', selectedFolderID]}, (previousLists) => {
                                    if(!previousLists) return previousLists
                                    return previousLists.map(list => 
                                        list.id === response.task.listId 
                                            ? { ...list, tasks: [response.task, ...list.tasks] } 
                                            : list
                                    )
                                })
                            }
                        }
                    })
                }else{
                    handleResponse({
                        request: () => addList({title:title, folderID:selectedFolderID}),
                        onSuccess: (response: addListResponse) => {
                            if(response.success){
                                setNewTitle("")
                                queryClient.setQueriesData<ListWithTaskAndFolder[]>({queryKey:['lists', selectedFolderID]}, (previousLists) => {
                                    if(!previousLists) return previousLists
                                    return [...previousLists, response.newList]
                                })
                            }
                        }
                    })
                }
            }
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