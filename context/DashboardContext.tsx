"use client"

import { getFolders } from '@/app/actions/folder'
import { getLists } from '@/app/actions/list'
import useStorageState from '@/hooks/useStorageState'
import { FolderWithList, ListWithTaskAndFolder } from '@/types/list'
import { TrashFilter } from '@/types/trashFilter'
import { userType } from '@/types/user'
import { Task } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react'

// ============================================================================
// Types
// ============================================================================

interface DashboardContextType {
  /** L'utilisateur de la session*/
  user: userType
  /** Est-ce que les dossiers sont en train d'être récupérer */
  isLoadingFolders: boolean
  /** Listes du dossier actuel (fetch via React Query) */
  folders: FolderWithList[]
  /** Est-ce que les listes sont en train d'être récupérer */
  isLoadingLists: boolean
  /** Listes du dossier actuel (fetch via React Query) */
  lists: ListWithTaskAndFolder[]
  /** ID du dossier actuel (extrait de l'URL) */
  selectedFolderID: string | null
  /** ID de la liste standalone si vue liste unique (extrait des query params) */
  standaloneListID: string | null
  /** Le filtre d'affichage des éléments supprimés */
  trashFilter: TrashFilter
  setTrashFilter: Dispatch<SetStateAction<TrashFilter>>
  /** Tasks ordonnées de la liste standalone */
  orderedTasks: Task[]
  setOrderedTasks: Dispatch<SetStateAction<Task[]>>
  /** ID de la liste sélectionnée */
  selectedListID: string | null
  setSelectedListID: Dispatch<SetStateAction<string | null>>
  /** ID de la task sélectionnée */
  selectedTaskID: string | null
  setSelectedTaskID: Dispatch<SetStateAction<string | null>>
  // Les options de quelle liste sont ouvert
  selectedListOptions: ListWithTaskAndFolder | null
  setSelectedListOptions: Dispatch<SetStateAction<ListWithTaskAndFolder | null>>
  /** Task affichée dans le panneau de détail */
  taskDetail: Task | null
  setTaskDetail: Dispatch<SetStateAction<Task | null>>
  /** Valeur du champ de recherche */
  searchContextValue: string
  setSearchContextValue: Dispatch<SetStateAction<string>>
  /** Mode historique activé */
  historicView: boolean
  setHistoricView: Dispatch<SetStateAction<boolean>>
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({ children, user }: { children: ReactNode, user:userType }) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const selectedFolderID = (params.folderID as string) ?? null
  const standaloneListID = searchParams.get('standaloneID') ?? null

  
  const [trashFilter, setTrashFilter]               = useStorageState<TrashFilter>("no", "trashFilter")
  const [orderedTasks, setOrderedTasks]             = useState<Task[]>([])
  const [selectedListID, setSelectedListID]         = useState<string | null>(null)
  const [selectedTaskID, setSelectedTaskID]         = useState<string | null>(null)
  const [taskDetail, setTaskDetail]                 = useState<Task | null>(null)
  const [searchContextValue, setSearchContextValue] = useState('')
  const [historicView, setHistoricView]             = useState(false)
  const [selectedListOptions, setSelectedListOptions] = useState<ListWithTaskAndFolder | null>(null)


  const {data: folders = [], isLoading: isLoadingFolders, refetch:refetchFolders} = useQuery({
    queryKey: ['folders', user.id, trashFilter],
    queryFn: async () => {
      const result = await getFolders(user.id!, trashFilter)
      if (!result.success) throw new Error('Erreur chargement')
      const sortedFolders = result.folders.sort((a, b) => a.order - b.order)
      return sortedFolders as FolderWithList[]
    },
    enabled: !!user.id,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  })

  const { data: lists = [], isLoading: isLoadingLists, refetch:refetchLists } = useQuery({
    queryKey: ['lists', selectedFolderID, trashFilter],
    queryFn: async () => {
      const result = await getLists(selectedFolderID!, trashFilter)
      if (!result.success) throw new Error('Erreur chargement')
      return result.lists as ListWithTaskAndFolder[]
    },
    enabled: !!selectedFolderID,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if(selectedFolderID && !!folders.length){
      if(!folders.find(folder => folder.id === selectedFolderID)){
        router.push("/dashboard")
      }
    }
  }, [selectedFolderID, folders])


  return (
    <DashboardContext.Provider value={{
      user,
      folders, isLoadingFolders,
      lists, isLoadingLists,
      selectedFolderID,
      standaloneListID,
      trashFilter, setTrashFilter,
      orderedTasks, setOrderedTasks,
      selectedListID, setSelectedListID,
      selectedTaskID, setSelectedTaskID,
      taskDetail, setTaskDetail,
      searchContextValue, setSearchContextValue,
      historicView, setHistoricView,
      selectedListOptions, setSelectedListOptions
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboardContext must be used within DashboardProvider')
  return context
}