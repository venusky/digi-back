import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
const URL = process.env.URL_FRONT

const prisma = new PrismaClient()

export default async function handler (req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['PUT', 'DELETE'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'GET'){
            const {id} = req.query
            const data = await prisma.societe.findFirst({
                where: {
                    id: Number(id)
                }
            });
            if (data){
                return res.status(200).json({
                    societe: data,
                    success: 'ok'
                })
            } else {
                return  res.status(404).json({
                    message: 'Cet id n\'est associé à aucune société'
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