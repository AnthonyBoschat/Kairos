"use client"

import { getLists } from '@/app/actions/list'
import { FolderWithList, ListWithTaskAndFolder } from '@/types/list'
import { Task } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'

// ============================================================================
// Types
// ============================================================================

interface DashboardContextType {
  /** ID du dossier actuel (extrait de l'URL) */
  selectedFolderID: string | null
  /** ID de la liste standalone si vue liste unique (extrait des query params) */
  standaloneListID: string | null
  /** Est-ce que les lsits sont en train d'être récupérer */
  isLoadingLists: boolean
  /** Listes du dossier actuel (fetch via React Query) */
  lists: ListWithTaskAndFolder[]
  /** Tasks ordonnées de la liste standalone */
  orderedTasks: Task[]
  setOrderedTasks: Dispatch<SetStateAction<Task[]>>
  /** ID de la liste sélectionnée */
  selectedListID: string | null
  setSelectedListID: Dispatch<SetStateAction<string | null>>
  /** ID de la task sélectionnée */
  selectedTaskID: string | null
  setSelectedTaskID: Dispatch<SetStateAction<string | null>>
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

export function DashboardProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const selectedFolderID = (params.folderID as string) ?? null
  const standaloneListID = searchParams.get('standaloneID') ?? null

  const { data: lists = [], isLoading: isLoadingLists } = useQuery({
    queryKey: ['lists', selectedFolderID],
    queryFn: async () => {
      const result = await getLists(selectedFolderID!)
      if (!result.success) throw new Error('Erreur chargement')
      return result.lists as ListWithTaskAndFolder[]
    },
    enabled: !!selectedFolderID,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  })

  const [orderedTasks, setOrderedTasks]             = useState<Task[]>([])
  const [selectedListID, setSelectedListID]         = useState<string | null>(null)
  const [selectedTaskID, setSelectedTaskID]         = useState<string | null>(null)
  const [taskDetail, setTaskDetail]                 = useState<Task | null>(null)
  const [searchContextValue, setSearchContextValue] = useState('')
  const [historicView, setHistoricView]             = useState(false)

  return (
    <DashboardContext.Provider value={{
      selectedFolderID,
      standaloneListID,
      lists, isLoadingLists,
      orderedTasks, setOrderedTasks,
      selectedListID, setSelectedListID,
      selectedTaskID, setSelectedTaskID,
      taskDetail, setTaskDetail,
      searchContextValue, setSearchContextValue,
      historicView, setHistoricView,
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