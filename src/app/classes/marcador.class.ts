
export class Marcador{

    public lat: number;
    public lng: number;
    public id: number;

    public titulo = 'Sin titulo';
    public desc =  'sin descripcion';

    constructor(lat: number, lng: number, id: number) {
        this.lat = lat;
        this.lng = lng;
        this.id = id;
    }
}