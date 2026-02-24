"use client"
import CheckIcon from "@/components/ui/icons/check"
import s from "./styles.module.scss"
import StarIcon from "@/components/ui/icons/Star"
import OptionsIcon from "@/components/ui/icons/Options"
import withClass from "@/utils/class"
import { useCallback } from "react"
import handleResponse from "@/utils/handleResponse"
import { toggleListCheckable, toggleListFavorite } from "@/app/actions/list"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContext } from "@/context/DashboardContext"
import { ListWithTaskAndFolder } from "@/types/list"

interface DefaultProps{
    list: ListWithTaskAndFolder
}


export default function ListInlineAction(props:DefaultProps){

    const queryClient = useQueryClient()
    const {setSelectedListOptions, selectedFolderID} = useDashboardContext()
    const isFavorite = props.list.favorite
    const isCheckable = props.list.checkable

    const handleToggleFavorite = useCallback(async() => {
        if(props.list){
            const listID = props.list.id
            handleResponse({
                request: () => toggleListFavorite(listID),
                onSuccess: () => {
                    queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                        previousLists?.map(list =>
                            list.id === listID
                                ? { ...list, favorite: !list.favorite }
                                : list
                        )
                    )
                }
            })
        }
    }, [props.list])

    const handleToggleCheckable = useCallback(async() => {
        if(props.list){
            const listID = props.list.id
            handleResponse({
                request: () => toggleListCheckable(listID),
                onSuccess: () => {
                    queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                        previousLists?.map(list =>
                            list.id === listID
                                ? { ...list, checkable: !list.checkable }
                                : list
                        )
                    )
                }
            })
        }
    }, [props.list])

    const handleToggleListOption = useCallback(async() => {
        if(props.list){
            setSelectedListOptions(props.list)
        }
    }, [props.list])

    return(
        <>
            <button title={isCheckable ? "Rendre les éléments non réalisable" : "Rendre les éléments réalisable"} className={withClass(s.action, s.checkable, isCheckable && s.active)} onClick={handleToggleCheckable}>
                <CheckIcon inactiveIcon="check" active={isCheckable} size={18}/>
            </button>
            <button title={isFavorite ? "Retirer la liste des favoris" : "Ajouter la liste aux favoris"} className={withClass(s.action, s.favorite )} onClick={handleToggleFavorite}>
                <StarIcon animate active={isFavorite} size={18}/>
            </button>
            <button title="Afficher les options de la liste" className={withClass(s.action, s.options)} onClick={handleToggleListOption}>
                <OptionsIcon size={20}/>
            </button>
        </>
    )
}