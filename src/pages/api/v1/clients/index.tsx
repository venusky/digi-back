import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
const URL = process.env.URL_FRONT

const prisma = new PrismaClient()

import twilio from 'twilio';
require('dotenv').config({ path: '.env.local' });
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const params = twilio(twilioSid, authToken)

export default async function handler (req:NextApiRequest, res:NextApiResponse){
    const { id } = req.query;
    // console.log(id)

    await Cors(req, res, {
        methods: ['GET', 'POST'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'GET'){
            const customers = await prisma.client.findMany({

                include: { commande: true },
                orderBy: { fullname: "asc" },

            })
            if (customers){

                return res.status(200).json({

                    success: 'ok',
                    data: customers
                })
            } else {
                return res.status(404).json({
                    message: 'Pas de données clients'
                })
            }
        } else if (req.method === 'POST'){
            const { name, company, postal, phone, email, iban, tva } = req.body;
            const verifyCustomer = await prisma.client.findFirst({
                where: { email: email }
            });
            if (verifyCustomer){
                return res.status(404).json({message: 'Cet client existe déjà dans votre base'})
            } else {
                const code = cryptoRandomString({length: 8, type: 'numeric'});
                const addCustomer = await prisma.client.create({
                    data:{
                        matricule: code,
                        fullname: name,
                        companyName: company,
                        adressPostal: postal,
                        phone: phone,
                        email: email,
                        iban: iban,
                        tva: tva
                    }
                });
                // const sms = await params.messages.create({
                //     body: `Digiarti, code (${code}). Merci \nde saisir ce code pour signer \n le bon de commande. le \ncas échéant le mandat de \nprélèvement (code non réutilisable, expire dans 15min)`,
                //     from: process.env.TWILIO_PHONE_NUMBER,
                //     to: String(addCustomer.phone)
                // })
                return res.status(200).json({success: 'ok', clients:{addCustomer}, message: `Client ${addCustomer.fullname} ajoué avec succès`})
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}