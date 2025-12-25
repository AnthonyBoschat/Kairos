"use client"

import { Task } from '@prisma/client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';





interface DashboardContextType {
  taskDetail: Task|null;
  setTaskDetail: Dispatch<SetStateAction<null|Task>>;
}
const DashboardContext = createContext<DashboardContextType | null>(null);




export function DashboardProvider({ children }: { children: ReactNode }) {

  const [taskDetail, setTaskDetail]     = useState<null|Task>(null)
  
  return (
    <DashboardContext.Provider value={{ taskDetail, setTaskDetail }}>
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