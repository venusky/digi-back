"use client"
// import {PDFViewer} from '@react-pdf/renderer';
import React from "react";
import MyDocument from "../../pdf/document";
import dynamic from "next/dynamic"

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <p>Loading...</p>,
    },
);

interface DocumentData {
    societe: any,
    condition: any,
    beginDate: any,
    endDate: any,
    horsTaxe: any,
    servicePrice: any,
    taxe:any,
    taxeService:any
}

const Invoice : React.FC<{ data: DocumentData }>  = ({data}) =>{


    return(
        <main className={"flex min-h-screen flex-col items-center justify-center gap-4 p-4"}>
            <div className={"w-full h-screen flex items-center justify-center"}>
                <PDFViewer className={"w-full h-full"}>
                    <MyDocument data={data}  />
                </PDFViewer>
            </div>
        </main>
    )
}

export default Invoice;
