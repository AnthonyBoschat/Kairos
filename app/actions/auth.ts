'use server';

import { randomBytes, createHash, scryptSync } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/mail';
import bcrypt from 'bcryptjs';

export async function sha256(value: string):Promise<string> {
  return createHash("sha256").update(value).digest("hex");
}


export async function forgotPassword(email: string) {
  
  const user = await prisma.user.findUnique({ where: { email } });

  // Toujours répondre OK pour ne pas révéler si l'email existe
  if (!user) return { success: true };

  // Générer un token
  const token     = randomBytes(32).toString('hex');
  const tokenHash = await sha256(token);

  // Supprimer les anciens tokens de cet utilisateur
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // Sauvegarder le hash
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset?token=${token}`;

  await sendMail({
    to: email,
    subject: 'Réinitialisation de mot de passe',
    html: `<p>Clique sur ce lien pour réinitialiser ton mot de passe :</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>Ce lien expire dans 15 minutes.</p>`,
  });

  return { success: true };
}


export type ResetPasswordResult =
  | { success: true, message: string }
  | { success: false; message: string }

export async function resetPassword(formData: FormData): Promise<ResetPasswordResult> {

  const token = String(formData.get("token") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  // throw new Error("Lien invalide. Demande un nouveau reset.")
  if (!token) throw new Error("Lien invalide. Demande un nouveau reset.")
  if (newPassword !== confirmPassword) throw new Error("Les mots de passe ne correspondent pas.")
  

  const tokenHash = await sha256(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  });

  const now = new Date();
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) throw new Error("Lien invalide, expiré, ou déjà utilisé." )

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: now },
    }),
  ]);

  return { success: true, message:"Nouveau mot de passe enregistré avec succès" };
  
}