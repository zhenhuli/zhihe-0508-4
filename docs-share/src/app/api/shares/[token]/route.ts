import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const body = await request.json();
    const { isActive, remark } = body;

    const existingShare = await prisma.share.findUnique({
      where: { token: params.token },
    });

    if (!existingShare) {
      return NextResponse.json({ message: "分享链接不存在" }, { status: 404 });
    }

    const share = await prisma.$transaction(async (tx) => {
      const updatedShare = await tx.share.update({
        where: { token: params.token },
        data: { isActive },
      });

      if (existingShare.isActive !== isActive) {
        await tx.shareStatusHistory.create({
          data: {
            shareId: updatedShare.id,
            isActive,
            remark: remark || null,
          },
        });
      }

      return updatedShare;
    });

    const shareWithHistory = await prisma.share.findUnique({
      where: { id: share.id },
      include: { history: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(shareWithHistory);
  } catch (error) {
    console.error("更新分享链接失败:", error);
    return NextResponse.json(
      { message: "更新分享链接失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await prisma.share.delete({
      where: { token: params.token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除分享链接失败:", error);
    return NextResponse.json(
      { message: "删除分享链接失败" },
      { status: 500 }
    );
  }
}
