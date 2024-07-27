import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
import path from "node:path";
import {hooks} from "prismjs";
import add = hooks.add;
import {render} from "@react-email/components";
import {renderToStream} from "@react-pdf/renderer";
import Invoice from "@/pages/invoice";
import MyDocument from "../../../../../pdf/document";
import {number} from "prop-types";
import {start} from "node:repl";
const URL = process.env.URL_FRONT

const prisma = new PrismaClient()
var MicroInvoice = require('../../../../../lib')

export default async function handler (req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['GET', 'POST'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'GET'){
            const commandes = await prisma.commande.findMany({
                include: {
                    client: true,
                    prelevements: {
                    include: {
                        prelevement: true
                    }
                    } },
                orderBy: { createdAt: "asc" },
            })
            if (commandes){
                return res.status(200).json({
                    success: 'ok',
                    data: commandes
                })
            } else {
                return res.status(404).json({
                    message: 'Pas encore de commande enrégistrées'
                })
            }
        } else if (req.method === 'POST'){
            const customer = await prisma.client.findFirst({
                where: {
                    matricule: req.body.client
                }
            })
            if (customer){
                const today = new Date();
                const last = new Date(today);
                last.setDate(today.getDate() + 15);

                const IDCustomer = customer.id
                const TTC = parseFloat(req.body.subsolde) + parseFloat(req.body.serviceprice) + parseFloat(req.body.taxeprice);
                const code = cryptoRandomString({length: 8, type: 'numeric'});
                const addCommande = await prisma.commande.create({
                    data:{
                        code: code,
                        taxe: parseFloat(req.body.taxeprice),
                        servicePrice: parseFloat(req.body.serviceprice),
                        taxeService: parseFloat(req.body.taxeService),
                        payementMethod: req.body.paidMethod.paidname,
                        ownerName: req.body.paidMethod.ownername,
                        beginDate: today,
                        endDate: last,
                        cardNumber: req.body.paidMethod.cardnumber,
                        horsTaxe: parseFloat(req.body.subsolde),
                        TTC : TTC,
                        conditionId: req.body.condition,
                        clientId: IDCustomer,
                        societeId: req.body.company,
                    }

                })
                if (addCommande){
                    const data = req.body.products;
                    const productMap = data.map((product: any) => ({
                        libelle: product.name,
                        details: product.details,
                        unitPrice: parseFloat(product.price),
                        quantity: parseFloat(product.quantity),
                        commandeId: addCommande.id,
                    }))
                    const setAarticle = await prisma.articles.createMany({
                        data: productMap,
                        skipDuplicates: true,
                    });
                    if (setAarticle){
                        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        // @ts-ignore
                        const currentDate = new Date().toLocaleDateString('fr-FR', dateOptions);
                        const imagePath = path.join(process.cwd(), 'public', 'Digiarti.jpg');
                        const details = await prisma.commande.findFirst({
                            where: {
                                id: addCommande.id
                            },
                            select:{
                                createdAt:true,
                                code:true,
                                taxe: true,
                                servicePrice:true,
                                payementMethod:true,
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
                        });
                        if (details){
                            const stream = await renderToStream(
                                <MyDocument data={details} />
                            );
                            res.setHeader('content-Type', 'application/pdf');
                            res.setHeader('content-Disposition', `attachement; filename=facture_${details.code}.pdf`);
                            stream.pipe(res)
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}