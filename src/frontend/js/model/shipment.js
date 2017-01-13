export class Shipment {
    constructor(date, supplierID, rawMatID, typeID, quantity) {
        this.date = date;
        this.year = new Date(date).getFullYear();
        this.month = new Date(date).getMonth() + 1;
        this.day = new Date(date).getDate();
        this.CUS_NO = supplierID;
        this.PRD_NO = rawMatID;
        this.typeID = typeID;
        this.quantity = quantity;
    }
}
