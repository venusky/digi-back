import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import { PrismaClient } from "@prisma/client";
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: process.env.URL_FRONT,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'POST'){
            const data = await prisma.user.findFirst({
                where: {
                    email: req.body.email,
                },
                select:{
                    email: true,
                    password:true,
                    name: true,
                    firstname: true
                }
            });
            if (!data){
                return res.status(404).json({message: "Utilisateur introuvable"})
            } else {
                const checkPassword = await bcrypt.compareSync(req.body.password, data.password);
                if (!checkPassword || data.email !== req.body.email){
                    return res.status(404).json({message: "email ou mot de passe incorrect"})
                }
                return res.status(200).json(data);
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}