import React from "react";
import { promises as fs } from "fs";
import type { Prisma } from "@prisma/client";
import prisma from "./db";
import path from "path";
import tailplug from "@/lib/TailPlug";
import Link from "next/link";

interface Time {secs_since_epoch:number}

export async function getData() {
  try {
    const data = await prisma.colors.findMany({
      where: {
        guild_id: "130763680160677888"
      }
    });
    return data.sort((a ,b)=>(a.time as unknown as Time).secs_since_epoch-(b.time as unknown as Time).secs_since_epoch).slice(1);
  } catch (e) {
    console.log(e);
    throw e;
  }
}