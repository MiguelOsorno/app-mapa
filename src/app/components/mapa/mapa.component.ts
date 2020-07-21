import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

import * as Mapboxgl from 'mapbox-gl';
import { Marcador } from '../../classes/marcador.class';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  indice = 0;

  marcadores: Marcador[] = [];

  arrayDeMarcadores: Mapboxgl.Marker[] = [];

  mapa: Mapboxgl.Map;

  botonesBorrar: any  = [];

  idBotones = 0;

  seCargoDelStorage = false;

  constructor( private snackBar: MatSnackBar ) {}


   crearMarcadoresDeStorage = () => {
    let contador = 0;
    this.marcadores.forEach( (marcador) => {
      this.crearMarcador(marcador.lng, marcador.lat, marcador.id);
      this.establecerEventoEnMarcadores(contador);
      ++contador;
    });
    this.seCargoDelStorage = false;
   }



  ngOnInit() {
    (Mapboxgl as any ).accessToken = environment.maxboxKey;
    this.mapa = new Mapboxgl.Map({
    container: 'mapa-mapbox',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-75.7611979, 45.3516034],
    zoom: 16.6
    });

    if ( localStorage.getItem('marcadores') ){
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
      if (this.marcadores.length > 0){
        this.seCargoDelStorage = true;
        this.crearMarcadoresDeStorage();
        this.idBotones = this.marcadores[(this.marcadores.length - 1)].id + 1;
        this.indice = this.marcadores.length;
      }
    }

    this.mapa.on('click', (e) => {
      const nuevoMarcador = new Marcador(e.lngLat.lat, e.lngLat.lng, this.idBotones );

      this.marcadores.push(nuevoMarcador);

      this.guardarStorage();

      this.crearMarcador( nuevoMarcador.lng, nuevoMarcador.lat, nuevoMarcador.id);

      this.establecerEventoEnMarcadores(this.indice);

      this.idBotones++;
      this.indice++;
    });





  }




  crearMarcador = (lng: number, lat: number, id: number ) => {

    const popup = new Mapboxgl.Popup({ offset: 25}).setHTML(
      '<strong style="color: black">Titulo</strong>' +
      '<br>' + '<p style="color:black">Lorem ipsum</p>' +
      '<div>' +
        '<button class="btn btn-pink">Editar</button>' +
        '<button id="' + id + '" class="btn btn-oranje">Borrar</button>' +
      '</div>'
    );

    const marker = new Mapboxgl.Marker({
      draggable: false
      }).setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.mapa);

    this.arrayDeMarcadores.push(marker);

    if (!this.seCargoDelStorage){
      this.snackBar.open('Marcador agregado', 'cerrar', { duration: 3000 });
    }

  }


  establecerEventoEnMarcadores = (indice: number) => {
    const marcador: Mapboxgl.Marker = this.arrayDeMarcadores[indice];
    marcador.getElement().addEventListener('mouseenter', () => {
      if (!marcador.getPopup().isOpen()){
        marcador.togglePopup();
        this.establecerEventoBotonesMarcadores();
      }
    });
  }

  establecerEventoBotonesMarcadores = () => {
    this.botonesBorrar = document.getElementsByClassName('btn-oranje');
    for (let contador = 0; contador < this.botonesBorrar.length; contador++){
      if (this.botonesBorrar.item(contador)){
        this.botonesBorrar.item(contador).addEventListener('click', this.borrar );
      }
    }
  }


  guardarStorage = () => {
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );
  }

  borrar = (e) => {
    const id = e.target.id;
    let contador = 0;

    this.marcadores.forEach((marcador) => {

      if(marcador.id == id){
        this.marcadores.splice(contador, 1);
        this.arrayDeMarcadores[contador].remove();
        this.arrayDeMarcadores.splice(contador, 1);
        this.indice = this.marcadores.length;
        this.snackBar.open('Marcador borrado', 'cerrar', { duration: 3000 });
      }
      ++contador;
    });


    this.guardarStorage();
  }

}
