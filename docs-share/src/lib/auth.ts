import { prisma } from "@/lib/prisma";
import { Share, Document } from "@prisma/client";
import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + process.env.NEXTAUTH_SECRET)
    .digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

type ShareWithDocument = Share & { document: Document };

export type DocumentAccessResult =
  | { allowed: true }
  | { allowed: false; reason: "not_found" | "private" };

export type ShareAccessResult =
  | { allowed: true; share: ShareWithDocument }
  | { allowed: false; reason: "not_found" | "not_active" | "expired" | "wrong_password"; share?: ShareWithDocument };

export async function checkDocumentAccess(documentId: string): Promise<DocumentAccessResult> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    return { allowed: false, reason: "not_found" };
  }

  if (!document.isPublic) {
    return { allowed: false, reason: "private" };
  }

  return { allowed: true };
}

export async function checkShareAccess(
  token: string,
  password?: string
): Promise<ShareAccessResult> {
  const share = await prisma.share.findUnique({
    where: { token },
    include: { document: true },
  });

  if (!share) {
    return { allowed: false, reason: "not_found" };
  }

  if (!share.isActive) {
    return { allowed: false, reason: "not_active", share };
  }

  if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
    return { allowed: false, reason: "expired", share };
  }

  if (share.accessType === "PASSWORD") {
    if (!password || !verifyPassword(password, share.password || "")) {
      return { allowed: false, reason: "wrong_password", share };
    }
  }

  return { allowed: true, share };
}
