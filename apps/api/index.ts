import express from "express";
import { authMiddleware } from "./middleware";
import {prismaClient} from "db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/website", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const { url } = req.body;
    const data = await prismaClient.website.create({
        data: {
            userId,
            url
        }
    });
    res.json({
        id: data.id,
        msg: "Added website"
    });
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
    const websiteId = req.query.websiteId! as unknown as string;
    const userId = req.userId;
    const data = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId,
            disabled: false
        },
        include: {
            ticks: true
        }

    });
    res.json(data);
});

app.get("/api/v1/websites", authMiddleware, async (req,res) => {
    const userId = req.userId;
    const websites = await prismaClient.website.findMany({
        where: {
            userId,
            disabled: false
        },
        include: {
            ticks: true
        }
    });
    res.json(websites);
});

app.delete("/api/v1/website", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const websiteId = req.query.websiteId as string;

    await prismaClient.website.update({
        where: {
            id: websiteId,
            userId
        },
        data: {
            disabled: true
        }
    });
    res.json({
        msg: "Deleted website successfully"
    });
});


app.listen(8080, () => {
    console.log("App running on port 8080.");
});