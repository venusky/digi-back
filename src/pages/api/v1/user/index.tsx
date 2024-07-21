import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import cryptoRandomString from "crypto-random-string";
import Cors from "nextjs-cors";
const bcrypt = require('bcrypt')

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

const prisma     = new PrismaClient()
export default async function handler(req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: process.env.URL_FRONT,
        optionsSuccessStatus: 200,
    })

    try {
        if (req.method === 'GET'){
            const data = await prisma.user.findFirst({
                where: {id: Number(req.body.id)}
            });
            if (data){
                res.status(200).json({
                    data,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: 'Utilisateur introuvable',
                    success: false
                })
            }
        } else if (req.method === 'POST'){
            const {name, firstname, email, password} = req.body;
            const userExist = await prisma.user.findFirst({
                where: {
                    name: name,
                    firstname: firstname
                }
            });
            if (userExist){
                res.status(404).json({message: 'Cet utilisateur existe déjà'})
            } else {
                const verifyEmail = await prisma.user.findFirst({
                    where: {email: email}
                });
                if (verifyEmail){
                    res.status(404).json({message: 'Cet email est déjà assoicé à un compte, s\'il vous appartient veuillez simplement recupérer le compte}'})
                } else {
                    const token = cryptoRandomString({length: 6, type: 'alphanumeric'});
                    const hash = bcrypt.hashSync(password, salt);
                    const idCompany = await prisma.societe.findFirst({
                        select: {id: true}
                    })
                    if (idCompany){
                        const insertUser = await prisma.user.create({
                            data: {
                                name: name,
                                firstname: firstname,
                                email: email,
                                token: token,
                                password: hash,
                                companyId: idCompany.id
                            }
                        });
                        return res.status(200).json({
                            message: `Utilisateur ${name + ' ' + firstname} enrégistré avec succès`,
                            user: insertUser,
                            success: 'ok'
                        })
                    } else {
                        res.status(409).json({message: 'Erreur de sauvegarde de données'})
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur'})
    } finally {
        await prisma.$disconnect()
    }
}