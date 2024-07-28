"use client"

import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
// import {logo} from '../public/Digiarti.jpg'

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
const MyDocument : React.FC<{ data: DocumentData }> = ({data}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <View>
                    <Text>DIGIARTI</Text>
                    <Image src={"../Digiarti.jpg"} style={styles.image} />
                </View>
                <View style={{
                    width: '100%',
                }}>
                    <View style={{
                        height: '20%',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        margin:10,
                        marginLeft:200,
                        gap:8
                    }}>
                        <Text style={{
                                fontSize:16,
                                fontWeight: 'bold',
                            }}>{data.societe.name}</Text>
                        <Text style={{
                                fontSize:16,
                                fontWeight: 'bold',
                            }}>{data.societe.phone}</Text>
                        <Text style={{
                                fontSize:16,
                                fontWeight: 'bold',
                            }}>{data.societe.adress}</Text>
                        <Text style={{
                                fontSize:16,
                                fontWeight: 'bold',
                            }}>{data.societe.adressPostal}</Text>
                        <Text style={{
                                fontSize:16,
                                fontWeight: 'bold',
                            }}>{data.societe.city}  {data.societe.country}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{
                            backgroundColor:'#7209b7',
                            flexDirection: 'column',
                            margin:10,
                            borderRadius:10,
                            justifyContent:'center',
                            alignItems:'flex-end',
                            height:'50',
                        }}>
                            <Text style={{
                                fontSize:16,
                                fontWeight: 'bold',
                                color: '#FFF'
                            }}>Proposition Commerciale</Text>
                            <Text style={{
                                fontSize:14,
                                color: '#FFF'
                            }}>du { new Date(data.beginDate).toLocaleDateString()} valable jusqu'au {new Date(data.endDate).toLocaleDateString()}</Text>
                        </View>
                        <View style={{
                            backgroundColor:'#7209b7',
                            flexDirection: 'column',
                            margin:10,
                            borderRadius:10,
                            justifyContent:'center',
                            // alignItems:'flex-end'
                            height:'50%'
                        }}>
                            <View style={{
                                height:20,
                                justifyContent:'center',
                                marginLeft: 10
                            }}>
                                <Text style={{fontSize:12, color:'#FFF'}}>Solution de communication à la facturation mensuelle</Text>
                            </View>
                            <View style={{
                                flexDirection:'column',
                                backgroundColor: '#edede9',
                                width:'100%',
                                height:'65%',
                                justifyContent:'space-around',
                            }}>
                                <Text style={{
                                    fontSize:14,
                                    fontWeight:'bold',
                                    marginLeft:10
                                }}>Offre booster</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent:'space-around',
                                    gap:4
                                }}>
                                    <View style={{
                                        flexDirection: 'column',
                                        alignContent: 'center',
                                        justifyContent: 'space-between',
                                        gap:4
                                    }}>
                                        <Text style={{
                                            fontSize:12
                                        }}>Montant Mensuel</Text>
                                        <Text style={{
                                            fontSize:12
                                        }}>Frais de service</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'column',
                                        alignContent: 'center',
                                        justifyContent: 'space-around',
                                        gap:4
                                    }}>
                                        <Text style={{
                                            fontSize:12
                                        }}>{(data.horsTaxe).toFixed(2)} € / mois</Text>
                                        <Text style={{
                                            fontSize:12
                                        }}>{(data.servicePrice).toFixed(2)} €</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent:'space-between',
                                    marginRight:40,
                                    marginLeft:6,
                                }}>

                                    <View style={{
                                        flexDirection: 'column',
                                        gap:8
                                    }}>
                                        <Text style={{
                                            fontSize:12
                                        }}>Total HT avant remises et promotions si applicables</Text>
                                        <Text style={{
                                            fontSize:12
                                        }}>Total Frais de service </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'column',
                                        gap:8
                                    }}>
                                        <Text style={{
                                            fontSize:12
                                        }}>{(data.servicePrice).toFixed(2)} € / mois</Text>
                                        <Text style={{
                                            fontSize:12
                                        }}>{(data.servicePrice).toFixed(2)} €</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex:1,
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                alignItems:'center',
                                gap: 8,
                            }}>
                                <View style={{
                                    margin:6,
                                    flexDirection: 'column',
                                    gap:8
                                }}>
                                    <Text style={{
                                        fontSize:12,
                                        fontWeight:'bold',
                                        color:'#FFF'
                                    }}>Total HT</Text>
                                    <Text style={{
                                        fontSize:12,
                                        color:'#FFF'
                                    }}>TVA 20.00%</Text>
                                    <Text style={{
                                        fontSize:12,
                                        fontWeight:'bold',
                                        color:'#FFF'
                                    }}>Total TTC</Text>
                                </View>
                                <View style={{
                                    margin:6,
                                    flexDirection: 'column',
                                    gap:8
                                }}>
                                    <Text style={{
                                        fontSize:12,
                                        fontWeight:'bold',
                                        color:'#FFF'
                                    }}>{(data.horsTaxe).toFixed(2)} € / mois; F.Serv. : {(data.servicePrice).toFixed(2)} €</Text>
                                    <Text style={{
                                        fontSize:12,
                                        color:'#FFF'
                                    }}>{(data.taxe).toFixed(2)} € / mois; F.Serv. : {(data.taxeService).toFixed(2)} €</Text>
                                    <Text style={{
                                        fontSize:12,
                                        fontWeight:'bold',
                                        color:'#FFF'
                                    }}>{(data.horsTaxe + data.taxe).toFixed(2)} € / mois; F.Serv. : {(data.servicePrice + data.taxeService).toFixed(2)} €</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginRight:20
                    // width: '15%',
                    // transform: 'rotate(-90deg)',
                    // position: 'relative'
                }} fixed={true}>
                    <Text style={{
                        width:'100%',
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'left top',
                        flexWrap: 'nowrap',
                        fontSize:10
                    }}>{data.societe.typeJuridique} Au capital de {(data.societe.capital).toFixed(2)} Euros - {data.societe.adress} - TVA Immatriculation: {data.societe.taxeImma} - NAF: {data.societe.NAF}</Text>
                </View>
            </View>
            <View style={styles.fixed} fixed={true}>
                <View style={{
                    backgroundColor: '#edede9',
                    paddingLeft: 10,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    height:20,
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        fontSize:12,
                        fontWeight:'bold'
                    }}>Conditions particulières</Text>
                </View>
                <View style={{
                    padding:10,
                    justifyContent: 'center',
                }}>
                    <Text style={{fontSize:12}}>{data.condition.libelle}</Text>
                </View>
            </View>

        </Page>
    </Document>
);

export default MyDocument;

// Create styles
const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        justifyContent:'center',
        backgroundColor: '#FFF',
    },
    section: {
        margin: 10,
        marginRight:10,
        flexDirection:'row',
        flexGrow: 1
    },
    image: {
        width: 100,
        height: 'auto',
    },
    fixed:{
        borderColor: '#7209b7',
        borderWidth: 2,
        margin:10,
        borderRadius:10,
    },
});