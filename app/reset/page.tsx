import { prisma } from "@/lib/prisma";
import ResetPasswordForm from "./ResetPasswordForm";
import { sha256 } from "../actions/auth";
import s from "./styles.module.scss";

type ResetPageProps = {
  searchParams: { token?: string };
};


export default async function ResetPage({ searchParams }: ResetPageProps) {

  const { token: tokenParam } = await searchParams;
  const token = (tokenParam ?? "").trim();

  if (!token) {
    return (
      <div>
        <p>Lien invalide. Demande une nouvelle réinitialisation.</p>
        <a href="/forgot">Demander un nouveau mot de passe</a>
      </div>
    );
  }

  const tokenHash = await sha256(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { expiresAt: true, usedAt: true },
  });

  const now = new Date();
  const isValid = !!resetToken && resetToken.usedAt === null && resetToken.expiresAt > now;

  if (!isValid) {
    return (
      <div className={s.container}>
        <p>Ce lien est invalide, expiré, ou déjà utilisé.</p>
        <a style={{marginLeft:"0.5rem"}} href="/forgot">Demander un nouveau mot de passe</a>
      </div>
    );
  }

  // Token valide => on affiche le formulaire
  return <ResetPasswordForm token={token} />;
}
