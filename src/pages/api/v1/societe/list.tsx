import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: process.env.URL_FRONT,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'GET'){
            const company = await prisma.societe.findMany();
            // console.log(company)
            if (company){
                res.status(200).json({
                    success: true,
                    company
                })
            } else {
                res.status(404).json({
                    message: 'Aucune données dans la table societe',
                    success: false
                })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}