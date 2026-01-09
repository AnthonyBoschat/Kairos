"use client"

import { Task } from '@prisma/client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';





interface DashboardContextType {
  taskDetail: Task|null
  setTaskDetail: Dispatch<SetStateAction<null|Task>>
  selectedFolderID: null|string
  setSelectedFolderID: Dispatch<SetStateAction<null|string>>
  selectedListID: null|string
  setSelectedListID: Dispatch<SetStateAction<null|string>>
  selectedTaskID: null|string
  setSelectedTaskID: Dispatch<SetStateAction<null|string>>
  searchContextValue: string
  setSearchContextValue: Dispatch<SetStateAction<string>>
  historicView: boolean
  setHistoricView: Dispatch<SetStateAction<boolean>>
}
const DashboardContext = createContext<DashboardContextType | null>(null);




export function DashboardProvider({ children }: { children: ReactNode }) {

  const [taskDetail, setTaskDetail]                 = useState<null|Task>(null)
  const [selectedFolderID, setSelectedFolderID]     = useState<null|string>(null)
  const [selectedListID, setSelectedListID]         = useState<null|string>(null)
  const [selectedTaskID, setSelectedTaskID]         = useState<null|string>(null)
  const [searchContextValue, setSearchContextValue] = useState<string>("")
  const [historicView, setHistoricView]             = useState(false)
  
  return (
    <DashboardContext.Provider value={{ 
      taskDetail, setTaskDetail,
      selectedFolderID, setSelectedFolderID,
      selectedListID, setSelectedListID,
      selectedTaskID, setSelectedTaskID,
      searchContextValue, setSearchContextValue,
      historicView, setHistoricView
    }}>
      {children}
    </DashboardContext.Provider>
  );

}






export function useDashboardContext() {

  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useUser must be used within DashboardProvider');
  }
  return context;

}