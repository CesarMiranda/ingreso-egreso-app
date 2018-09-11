export class User {

    public nombre: string;
    public uid: string;
    public email: string;

    constructor(obj: DataObj) {
        this.nombre = obj && obj.nombre || null;
        this.email = obj && obj.email || null;
        this.uid = obj && obj.uid || null;
    }
}

interface DataObj {
    uid: string;
    email: string;
    nombre: string;
}
