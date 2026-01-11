"use client"
import s from "./styles.module.scss"
import Brand from "@/components/brand";
import Presentation from "./_components/Presentation";
import AuthCard from "./_components/AuthCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Home() {

 
  const searchParams  = useSearchParams()
  const router        = useRouter()
  useEffect(() => {
    if(searchParams.get("signedOut") === "true") {
      toast.success("Vous avez été déconnecter")
      router.push("/")
    }
  }, [searchParams])

  return (
    <div className={s.page}>

      <div className={s.left}>
        <div className={s.brand}>
          <Brand scale={0.9}/>
        </div>
        <Presentation/>
      </div>

      <div className={s.right}>
        <AuthCard/>
      </div>


    </div>
  );
}