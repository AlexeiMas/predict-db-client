export interface Gene { proteins: string[]; aliases: string[]; genes: string[]; };
export interface Tumour { primary: string[]; sub: string[]; };
export interface Responses { treatment: string[]; response: string[]; };
export interface History { treatment: string[]; response: string[]; };