import ENV from "@/constants/env";
import s from "./styles.module.scss"
import AppTitle from "./api/_components/Title";
import AppStatus from "./api/_components/Status";
import { addStatus, initStatuses } from "./actions/status";
import { prisma } from "@/lib/prisma";

export default async function Home() {


  await initStatuses(); // Initialise si besoin
  const status = await prisma.status.findMany();

  return (
    <div className={s.page}>
      <div className={s.container}>
        <AppTitle/>
        <AppStatus statuses={status}/>
      </div>
    </div>
  );
}
