import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
import path from "node:path";
import {hooks} from "prismjs";
import concat from 'concat-stream';
import add = hooks.add;
import {render} from "@react-email/components";
import {renderToStream} from "@react-pdf/renderer";
import MyDocument from "../../../../../pdf/document";
require('dotenv').config({ path: '.env.local' });

const URL = process.env.URL_FRONT


const prisma = new PrismaClient()

import twilio from 'twilio';
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const params = twilio(twilioSid, authToken)

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        stream.pipe(concat((data: Buffer) => resolve(data))).on('error', reject);
    });
}


import sgMail from '@/../lib/sendgrid'

export default async function handler (req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['GET', 'POST'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'POST'){
            const ID = req.query
            console.log(ID)
            const invoice = await prisma.commande.findFirst({
                where: {
                    code: String(ID.id)
                },
                select:{
                    createdAt:true,
                    code:true,
                    taxe: true,
                    servicePrice:true,
                    monthServicePrice:true,
                    payementMethod:true,
                    taxeMonthService:true,
                    cardNumber:true,
                    beginDate: true,
                    endDate: true,
                    taxeService: true,
                    TTC: true,
                    condition:true,
                    ownerName:true,
                    horsTaxe:true,
                    client: true,
                    societe: true
                }
            })
            if (invoice){
                const stream = await renderToStream(<MyDocument data={invoice} />);
                // générer le pdf
                const pdfBuffer = await streamToBuffer(stream)
                // Retourner le fichier PDF en tant que réponse
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=invoice-${ID.id}.pdf`);
                res.status(200).send(pdfBuffer);
            } else {
                res.status(404).json({ message: 'Invoice not found' });
            }
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}