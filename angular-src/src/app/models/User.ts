export interface User {
    _id?: string;
    nom: string;
    prenom: string;
    mail: string;
    tel: string;
    prefFumeur?:boolean;
    prefAnimaux?:boolean;
    prefMusique?:boolean;
    nbLiftsAsDriver?:number;
}