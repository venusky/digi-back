import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";
import url from "url";
import {PrismaClient} from "@prisma/client";

const URL = process.env.URL_FRONT
const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

    try{
        const redirectedLink = `${URL}/`
        const token = req.query.token;
        const reset = await prisma.user.findFirst({
            where : {
                token: token as string
            }
        })
        if (reset){
            const redirectedLink = `${URL}/auth/new-password?token=${token}&email=${encodeURIComponent(reset.email)}`;
            res.redirect(redirectedLink)
            // status(200).json({
            //     data: reset.email,
            //     success: true
            // })

        } else {
            return res.status(404).json({
                success: false,
                message: "Erreur de recupération du mot de passe, veuillez réessayer"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}