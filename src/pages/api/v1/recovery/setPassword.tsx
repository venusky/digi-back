import {NextApiRequest, NextApiResponse} from "next";
import Cors from "nextjs-cors";

const URL = process.env.URL_FRONT

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    await Cors(req, res, {
        methods: ['GET', 'POST', 'PUT'],
        origin: URL,
        optionsSuccessStatus: 200,
    })

}