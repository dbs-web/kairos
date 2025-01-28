import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAuthorized } from "@/lib/api";
import { UserRoles } from "@/types/user";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest){
    const session = await getServerSession(authOptions);

    if (!isAuthorized(session, [UserRoles.ADMIN]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const logs = await prisma.apiLog.findMany()

    return NextResponse.json({data: logs, status: 200})
}