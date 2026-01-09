import { HistoryEntry } from "@/types/history";
import s from "../styles.module.scss"
import messageBuilder from "./messageBuilder";

const formatDate = (dateInput:Date) => {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}h${minutes}`;
}




export default function historyBuilder(record: HistoryEntry) {

  const key = `${record.type}_${record.action}${record.action === "modified" ? `_${record.field}` : ""}`.toLowerCase()

  const typeLabelAction = {
    FOLDER: "📁 Dossier",
    LIST: "🧾 Liste",
    TASK: "✅ Élément"
  }

  const colorByAction = {
    created: "rgb(28, 148, 62)",
    modified: "rgb(25, 113, 184)",
    deleted: "rgb(175, 33, 33)",
  }

  const cardColorByAction = {
    created: "rgb(28, 148, 62, 0.4)",
    modified: "rgb(25, 113, 184, 0.4)",
    deleted: "rgb(175, 33, 33, 0.4)",
  }







  return (
    <div className={s.row} style={{backgroundColor:colorByAction[record.action]}} >
        <div className={s.card} style={{border:`1px solid ${cardColorByAction[record.action]}`}}>
          
            <div className={s.message}>
              {messageBuilder(key, record)}
            </div>

            <div className={s.header}>
              <div className={s.badges}>
                <span className={`${s.badge}`}>
                    {typeLabelAction[record.type]}
                </span>

              </div>
              <time className={s.time} dateTime={new Date(record.at).toISOString()}>
                  {formatDate(record.at)}
              </time>
            </div>

        </div>
    </div>
  );
}
