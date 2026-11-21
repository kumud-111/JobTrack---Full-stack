import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Prisma, PrismaClient, ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 4000;
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({ origin: frontendUrl ? [frontendUrl, "http://localhost:5173"] : true }));
app.use(express.json());

const statuses = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;
const schema = z.object({
  company: z.string().trim().min(1).max(100),
  role: z.string().trim().min(1).max(100),
  location: z.string().trim().max(100).optional(),
  jobUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(statuses).optional(),
  appliedAt: z.string().datetime().optional(),
  followUpDate: z.string().datetime().optional().or(z.literal("")),
  notes: z.string().max(2000).optional()
});
const route = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res)).catch(next);

app.get("/api/health", (_req, res) => res.json({ success: true, message: "JobTrack API is running" }));

app.post("/api/applications", route(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ success: false, errors: parsed.error.flatten() }); return; }
  const d = parsed.data;
  const data = await prisma.jobApplication.create({ data: {
    company:d.company, role:d.role, location:d.location || null, jobUrl:d.jobUrl || null,
    status:d.status ?? "APPLIED", appliedAt:d.appliedAt ? new Date(d.appliedAt) : undefined,
    followUpDate:d.followUpDate ? new Date(d.followUpDate) : null, notes:d.notes || null
  }});
  res.status(201).json({ success:true, data });
}));

app.get("/api/applications", route(async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status.toUpperCase() : undefined;
  const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
  if (status && !statuses.includes(status as typeof statuses[number])) {
    res.status(400).json({ success:false, message:`Invalid status: ${status}` }); return;
  }
  const data = await prisma.jobApplication.findMany({
    where:{
      ...(status ? {status:status as ApplicationStatus} : {}),
      ...(search ? {OR:[
        {company:{contains:search}},{role:{contains:search}},{location:{contains:search}}
      ]} : {})
    },
    orderBy:{createdAt:"desc"}
  });
  res.json({success:true,count:data.length,data});
}));

app.get("/api/stats", route(async (_req, res) => {
  const groups = await prisma.jobApplication.groupBy({by:["status"],_count:{_all:true}});
  const data:Record<string,number> = {total:await prisma.jobApplication.count(),WISHLIST:0,APPLIED:0,INTERVIEW:0,OFFER:0,REJECTED:0};
  groups.forEach(g => data[g.status] = g._count._all);
  res.json({success:true,data});
}));

app.get("/api/applications/:id", route(async (req,res) => {
  const id=Number(req.params.id);
  if(!Number.isInteger(id)||id<1){res.status(400).json({success:false,message:"Invalid ID"});return;}
  const data=await prisma.jobApplication.findUnique({where:{id}});
  if(!data){res.status(404).json({success:false,message:"Application not found"});return;}
  res.json({success:true,data});
}));

app.patch("/api/applications/:id", route(async (req,res) => {
  const id=Number(req.params.id);
  if(!Number.isInteger(id)||id<1){res.status(400).json({success:false,message:"Invalid ID"});return;}
  const parsed=schema.partial().safeParse(req.body);
  if(!parsed.success){res.status(400).json({success:false,errors:parsed.error.flatten()});return;}
  if(!Object.keys(parsed.data).length){res.status(400).json({success:false,message:"Provide fields to update"});return;}
  const d=parsed.data;
  const data=await prisma.jobApplication.update({where:{id},data:{
    ...d,jobUrl:d.jobUrl===""?null:d.jobUrl,
    appliedAt:d.appliedAt?new Date(d.appliedAt):undefined,
    followUpDate:d.followUpDate===""?null:d.followUpDate?new Date(d.followUpDate):undefined
  }});
  res.json({success:true,data});
}));

app.delete("/api/applications/:id", route(async (req,res) => {
  const id=Number(req.params.id);
  if(!Number.isInteger(id)||id<1){res.status(400).json({success:false,message:"Invalid ID"});return;}
  await prisma.jobApplication.delete({where:{id}});
  res.json({success:true,message:"Application deleted"});
}));

app.use((_req,res)=>res.status(404).json({success:false,message:"Route not found"}));
app.use((err:unknown,_req:Request,res:Response,_next:NextFunction)=>{
  if(err instanceof Prisma.PrismaClientKnownRequestError && err.code==="P2025"){
    res.status(404).json({success:false,message:"Application not found"});return;
  }
  console.error(err);
  res.status(500).json({success:false,message:"Internal server error"});
});
const server=app.listen(PORT,()=>console.log(`JobTrack API running at http://localhost:${PORT}`));
async function shutdown(){await prisma.$disconnect();server.close(()=>process.exit(0));}
process.on("SIGINT",shutdown);
process.on("SIGTERM",shutdown);
