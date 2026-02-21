"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "./styles.module.scss";
import { resetPassword } from "../actions/auth";
import { toast } from "react-toastify";
import handleResponse from "@/utils/handleResponse";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleResponse(async () => {
      setIsSubmitting(true);
      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.set("token", token);
      
      const result = await resetPassword(formData);
      
      
      toast.success(result.message)
      router.replace("/");  
      setIsSubmitting(false);
    }, () => {
      setIsSubmitting(false);
    })
    
  }

  return (
    <div className={s.container}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Nouveau mot de passe"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmer</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirmation"
          />
        </div>

        <input
          className={s.submit}
          type="submit"
          value={isSubmitting ? "Enregistrement..." : "Enregistrer mon nouveau mot de passe"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
