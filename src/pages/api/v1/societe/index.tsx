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
            const items = await prisma.societe.findFirst()
            if (items) {
                res.status(200).json({
                    data: items,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: 'Société non trouvée',
                    success: false
                })
            }
        } else if (req.method === 'POST') {
            const items = await prisma.societe.create({
                data: {
                    name: req.body.name,
                    typeJuridique: req.body.type,
                    adress: req.body.adress,
                    email: req.body.email,
                    website: req.body.site,
                    phone: req.body.tel,
                    NAF: req.body.naf,
                    capital: req.body.capital,
                    country: req.body.pays,
                    city: req.body.ville,
                    taxeImma: req.body.taxeImma,
                    manager: req.body.manager,
                    managerPhone: req.body.managerPhone,
                }
            });
            return res.status(200).json({
                message: 'Société paramétrée avec succès. Veuillez continuer',
                societe: items,
                success: 'ok'
            })
        } else if (req.method === 'PUT') {
            const { id, name, adresse, email, site, tel, naf, capitalSociale, pays, ville, taxe, representant, telRepresentant } = req.body;
            const updatedSociete = await prisma.societe.update({
                where: { id: Number(id) },
                data: {
                    name: name || null,
                    adress: adresse || null,
                    email: email || null,
                    website: site || null,
                    phone: tel || null,
                    NAF: naf || null,
                    capital: capitalSociale || null,
                    country: pays || null,
                    city: ville || null,
                    taxeImma: taxe || null,
                    manager: representant || null,
                    managerPhone: telRepresentant || null,
                },
            });
            res.status(200).json({
                message: 'Société mise à jour avec succès',
                societe: updatedSociete,
            });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            res.status(405).end(`Méthode non autorisée`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }

}