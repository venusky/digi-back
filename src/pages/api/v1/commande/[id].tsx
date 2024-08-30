import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
import {number} from "prop-types";
const URL = process.env.URL_FRONT

const prisma = new PrismaClient()

export default async function handler (req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['GET', 'PUT', 'DELETE'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'GET'){
            const {id} = req.query
            const commande = await prisma.commande.findFirst({
                where: {
                    code: String(id)
                },
                include:{
                    Articles: true,
                    condition : true,
                    client: true,
                    societe:true
                }
            });
            if (commande){
                return res.status(200).json({
                    invoice: commande,
                    success: 'ok'
                })
            } else {
                return  res.status(404).json({
                    message: 'Pas de commande qui dispose de cette référence'
                })
            }
        } else if (req.method === 'PUT') {
            const {id} = req.query
            const checkInvoice = await prisma.commande.findFirst({
                where:{code: String(id)},
            });
            if (checkInvoice){
                const updateCgu = await prisma.commande.update({
                    where:{
                        id:checkInvoice.id
                    },
                    data:{
                        canceled: true,
                        updatedAt: new Date()
                    }
                });
                return res.status(200).json({message: `Commande ${id} modifié avec succès`})
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