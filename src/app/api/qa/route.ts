import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { generateAnswer } from "../../../lib/llm";

let convex: any = null;

async function getConvex() {
  if (convex) return convex;
  if (typeof window !== "undefined") return null;
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return null;
  const { ConvexHttpClient } = await import("convex/browser");
  convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return convex;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoId, question } = await request.json();

    if (!repoId || !question) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    const repo = await client.query("repos:getById" as any, { id: repoId });
    if (!repo || repo.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const qaSessionId = await client.mutation("qa:createSession" as any, {
      repoId,
      question,
    });

    const relevantChunks = await client.query("index:search" as any, {
      repoId,
      query: question,
      limit: 5,
    });

    const context = relevantChunks
      .map((chunk: any) => `File: ${chunk.filePath}\n${chunk.content}`)
      .join("\n\n");

    const messages = [
      {
        role: "system",
        content: `You are a helpful code assistant. Answer the user's question about their codebase. 
        Use the provided code context to give accurate, specific answers. 
        If you're unsure about something, say so. Keep answers concise and relevant.`,
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ];

    const result = await generateAnswer(messages as any);

    await client.mutation("qa:updateWithAnswer" as any, {
      sessionId: qaSessionId,
      answer: result.text,
      sources: relevantChunks.map((chunk: any) => ({
        file: chunk.filePath,
        line: chunk.startLine,
        content: chunk.content,
      })),
    });

    const updatedSession = await client.query("qa:getSession" as any, {
      sessionId: qaSessionId,
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Q&A error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const repoId = searchParams.get("repoId");

    if (!repoId) {
      return NextResponse.json(
        { error: "Missing repoId" },
        { status: 400 }
      );
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    const sessions = await client.query("qa:listSessions" as any, {
      repoId,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Q&A error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
