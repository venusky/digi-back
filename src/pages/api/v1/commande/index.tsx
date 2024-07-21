import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
import path from "node:path";
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

                const IDCustomer = customer.id
                const TTC = parseFloat(req.body.subsolde) + parseFloat(req.body.serviceprice) + parseFloat(req.body.taxeprice);
                const code = cryptoRandomString({length: 8, type: 'numeric'});
                const addCommande = await prisma.commande.create({
                    data:{
                        code: code,
                        taxe: parseFloat(req.body.taxeprice),
                        servicePrice: parseFloat(req.body.serviceprice),
                        payementMethod: req.body.paidMethod.paidname,
                        ownerName: req.body.paidMethod.ownername,
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
                        let myInvoice = new MicroInvoice({
                            style : {
                                header : {
                                    image : {
                                        path : imagePath,
                                        width : 100,
                                        height : 100
                                    }
                                }
                            },
                            data : {
                                invoice : {
                                    name : "DIGIBOOST",

                                    header : [ {
                                        label : "Date",
                                        value :
                                            [
                                                "Big Corp",
                                                "2 Flowers Streets, London",
                                                "UK",
                                                "+44245345435345",
                                                "biling@bigcorp.com",
                                                currentDate
                                            ]
                                    }],

                                    currency : "EUR",

                                    customer : [{
                                        label : "Bill To",
                                        value : [
                                            customer.fullname,
                                            customer.companyName,
                                            customer.email,
                                            customer.phone,
                                            customer.adressPostal,
                                        ]
                                    },
                                    //     {
                                    //     label : "Tax Identifier",
                                    //     value : "352352342333"
                                    // }, {
                                    //     label : "Information",
                                    //     value : "Deliver to the door"
                                    // }
                                    ],

                                    // seller : [{
                                    //     label : "Bill From",
                                    //     value : [
                                    //         "Big Corp",
                                    //         "2 Flowers Streets, London",
                                    //         "UK",
                                    //         "+44245345435345",
                                    //         "biling@bigcorp.com"
                                    //     ]
                                    // }, {
                                    //     label : "Tax Identifier",
                                    //     value : "5345345345435345345"
                                    // }],

                                    legal : [{
                                        value  : "Codition particulière",
                                        weight : "bold",
                                        color  : "primary"
                                    }, {
                                        value  : req.body.libelleCGU,
                                        weight : "bold",
                                        color  : "secondary"
                                    }],

                                    details : {
                                        header : [{
                                            value : "Solution commerciale à facturation mensuelle"
                                        },
                                        //     {
                                        //     value : "Quantity"
                                        // }, {
                                        //     value : "Subtotal"
                                        // }
                                        ],

                                        parts : [
                                            [{
                                                value : "Offre Booster"
                                            },
                                            //     {
                                            //     value : 1
                                            // }, {
                                            //     value : "53",
                                            //     price : true
                                            // }
                                            ],

                                            [{
                                                value : "Discount"
                                            }, {
                                                value : 1
                                            }, {
                                                value : "-10",
                                                price : true
                                            }]
                                        ],

                                        total : [{
                                            label : "Total without VAT",
                                            value : "43",
                                            price : true
                                        }, {
                                            label : "VAT Rate",
                                            value : "20%"
                                        }, {
                                            label : "VAT Paid",
                                            value : "8.6",
                                            price : true
                                        }, {
                                            label : "Total paid with VAT",
                                            value : "51.6",
                                            price : true
                                        }]
                                    }
                                }
                            }
                        });
                        myInvoice.generate(`${code}.pdf`).then(()=>{
                            console.log("Invoice saved")
                        })
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