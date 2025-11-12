'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function initStatuses() {
  const count = await prisma.status.count();
  
  if (count === 0) {
    const statusToCreate = ["Writing", "Reading", "Walking", "Sleeping", "Working"];
    
    await prisma.status.createMany({
      data: statusToCreate.map(name => ({ name, state: true })),
    });
    
    redirect('/'); // Force le re-render
  }
}

export async function updateStatusState(statusID:string, statusState: boolean){
  await prisma.status.update({
    where:{
      id:statusID
    },
    data:{
      state: statusState
    }
  })
  revalidatePath("/")
}

export async function addStatus(statusName:string) {

  await prisma.status.create({
    data: {
      state: true,
      name: statusName
    },
  });
}
