import {
    Body,
    Container,
    Column,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";



export function ResetPasswordEmail (props: any) {
    let url: any;
    url = props
    return (
        <Html>
            <Head />
            <Preview>You updated the password for your Twitch account</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/*<Section style={logo}>*/}
                    {/*    <Img width={114} src={`${baseUrl}/static/twitch-logo.png`} />*/}
                    {/*</Section>*/}
                    <Section style={sectionsBorders}>
                        <Row>
                            <Column style={sectionBorder} />
                            <Column style={sectionCenter} />
                            <Column style={sectionBorder} />
                        </Row>
                    </Section>
                    <Section style={content}>
                        <Text style={paragraph}>Salut,</Text>
                        <Text style={paragraph}>
                            Vous avez demandez une réinitialisation de votre mot de passe.
                        </Text>
                        <Text style={paragraph}>
                            Veuillez cliquez sur ce lien pour réinitialiser votre mot de passe
                            <Link href={url} style={link}>
                                réinitialiser votre mot de passe
                            </Link>{" "}
                        </Text>
                        <Text style={paragraph}>
                            Merci,
                            <br />
                            DIGI BOOST
                        </Text>
                    </Section>
                </Container>

                <Section style={footer}>
                    <Row>
                        <Text style={{ textAlign: "center", color: "#706a7b" }}>
                            © 2024 DIGIBOOST, Tous droits reservés <br />
                            Paris - FRANCE
                        </Text>
                    </Row>
                </Section>
            </Body>
        </Html>
    );
};

export default ResetPasswordEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
    backgroundColor: "#efeef1",
    fontFamily,
};

const paragraph = {
    lineHeight: 1.5,
    fontSize: 14,
};

const container = {
    maxWidth: "580px",
    margin: "30px auto",
    backgroundColor: "#ffffff",
};

const footer = {
    maxWidth: "580px",
    margin: "0 auto",
};

const content = {
    padding: "5px 20px 10px 20px",
};

const logo = {
    display: "flex",
    justifyContent: "center",
    alingItems: "center",
    padding: 30,
};

const sectionsBorders = {
    width: "100%",
    display: "flex",
};

const sectionBorder = {
    borderBottom: "1px solid rgb(238,238,238)",
    width: "249px",
};

const sectionCenter = {
    borderBottom: "1px solid rgb(145,71,255)",
    width: "102px",
};

const link = {
    textDecoration: "underline",
};