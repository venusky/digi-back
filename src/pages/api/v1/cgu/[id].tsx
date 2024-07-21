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
        if(req.method === 'PUT'){
            const { idCgu,status} = req.body;
            const checkCgu = await prisma.cgu.findFirst({
                where:{id: idCgu},
                select:{
                    id: true,
                    titre:true,
                    libelle:true
                }
            });
            if (checkCgu){
                const updateCgu = await prisma.cgu.update({
                    where:{
                        id:checkCgu.id
                    },
                    data:{
                        titre: checkCgu.titre,
                        libelle: checkCgu.libelle,
                        status: status,
                        updatedAt: new Date()
                    }
                });
                return res.status(200).json({message: "CGU modifié avec succès"})
            } else {
                return res.status(404).json({message: 'Erreur de modification CGU'})
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}