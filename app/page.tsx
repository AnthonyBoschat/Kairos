import s from "./styles.module.scss";
import Brand from "@/components/brand";
import Presentation from "./_components/Presentation";
import AuthCard from "./_components/AuthCard";
import { Suspense } from "react";
import SignedOutToast from "./_components/SignedOutToast";

export default function Home() {
  return (
    <div className={s.page}>
      <Suspense fallback={null}>
        <SignedOutToast />
      </Suspense>

      <div className={s.left}>
        <div className={s.brand}>
          <Brand scale={0.9} />
        </div>
        <Presentation />
      </div>

      <div className={s.right}>
        <AuthCard />
      </div>
    </div>
  );
}
