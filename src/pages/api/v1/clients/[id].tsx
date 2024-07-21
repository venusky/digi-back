import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
import {number} from "prop-types";
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
            const { fullname, companyName, adressPostal, phone, email, iban, tva } = req.body;
            const checkCustomer = await prisma.client.findFirst({
                where:{email:email},
                select:{
                    id: true,
                    matricule: true
                }
            });
            if (checkCustomer){
                const updateCustomer = await prisma.client.update({
                    where:{
                        id:checkCustomer.id
                    },
                    data:{
                        matricule: checkCustomer.matricule,
                        fullname: fullname,
                        companyName: companyName,
                        adressPostal: adressPostal,
                        phone: phone,
                        email: email,
                        iban: iban,
                        tva: tva,
                        updatedAt: new Date()
                    }
                });
                return res.status(200).json({message: "Clients modifié avec succès"})
            } else {
                return res.status(404).json({message: 'Erreur de modification client'})
            }
        } else if (req.method === 'DELETE'){
            const verifyCustomer = await prisma.client.findFirst({
                where: { email: req.body.email },
                select: {
                    id: true
                }
            });
            const deleteCustomer = await prisma.client.delete({
                where: {
                    id: verifyCustomer.id
                }
            });
            return res.status(200).json({message: 'Clients supprimé avec succès'})
        } else if (req.method === 'GET'){
            const {id} = req.query
            const customer = await prisma.client.findFirst({
                where: {
                    matricule: id
                }
            });
            if (customer){
                return res.status(200).json({
                    customer: customer,
                    success: 'ok'
                })
            } else {
                return  res.status(404).json({
                    message: 'Pas de client qui dispose de cette référence, vous pouvez enrégistrer comme un nouveau client'
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