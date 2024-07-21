import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from "@prisma/client";
import Cors from 'nextjs-cors'

const URL = process.env.URL_FRONT

const prisma = new PrismaClient()
export default async function handler(req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: URL,
        optionsSuccessStatus: 200,
    })


    try {
        if (req.method === 'GET'){
            const items = await prisma.cgu.findMany()
            res.status(200).json(items)

        } else if (req.method === 'POST') {
            const findCgu = await prisma.cgu.findFirst({
                where: {
                    titre: req.body.titre
                }
            })
            if (findCgu){
                return res.status(404).json({
                    message: 'cette condition existe déjà',
                })
            } else {
                const items = await prisma.cgu.create({
                    data: {
                        titre: req.body.titre,
                        libelle: req.body.libelle,
                    }
                });
                return res.status(200).json({
                    message: 'Condition enrégistré avec succès. Veuillez continuer',
                    success: 'ok',
                    cgu: items
                })
            }
        }else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Méthode non autorisée`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }

}