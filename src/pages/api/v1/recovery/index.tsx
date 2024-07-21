import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import Cors from "nextjs-cors";
import {render} from "@react-email/components";
import ResetPasswordEmail from "../../../../../email/email_for_recovery";
import sgMail from '../../../../../lib/sendgrid'

const prisma = new PrismaClient()

export default async function handler (req:NextApiRequest, res:NextApiResponse){

    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: process.env.URL_FRONT,
        optionsSuccessStatus: 200,
    })
    try {
        if (req.method === 'POST'){
            const data = await prisma.user.findFirst({
                where:{
                    email: req.body.email
                },
                select:{
                    email: true,
                    token: true
                }
            });
            if (data){
                const recoveryLink = `http://localhost:3000/api/auth/confirm_token?token=${data.token}`
                const msg = {
                    to: data.email,
                    from: 'contact@digiarti.com',
                    subject: 'RESET EMAIL',
                    html: render(ResetPasswordEmail(recoveryLink))
                };

                await sgMail.send(msg)

                return res.status(200).json({message: 'Un lien de réinitialisation vous est envoyé, veuillez consulter votre boite email.'})
            } else {
                return res.status(404).json({message: 'erreur email'})
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur serveur interne'})
    } finally {
        await prisma.$disconnect()
    }
}