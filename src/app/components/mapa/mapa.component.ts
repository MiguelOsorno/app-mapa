import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

import * as Mapboxgl from 'mapbox-gl';
import { Marcador } from '../../classes/marcador.class';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  // lat = 51.678418;
  // lng = 7.809007;

  indice = 0;

  marcadores: Marcador[] = [];

  arrayDeMarcadores: Mapboxgl.Marker[] = [];

  mapa: Mapboxgl.Map;

  constructor() {}


   crearMarcadoresDeStorage(){
    this.marcadores.forEach( (marcador) => {
      this.crearMarcador(marcador.lng, marcador.lat);
      this.establecerEventoEnMarcadores(this.indice);
      this.indice++;
    });

    // this.establecerEventoEnMarcadores();
   }



  ngOnInit() {
    (Mapboxgl as any ).accessToken = environment.maxboxKey;
    this.mapa = new Mapboxgl.Map({
    container: 'mapa-mapbox',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-75.7611979, 45.3516034],
    zoom: 16.6
    });

    this.mapa.on('click', (e) => {
      const nuevoMarcador = new Marcador(e.lngLat.lat, e.lngLat.lng);

      this.marcadores.push(nuevoMarcador);

      this.guardarStorage();

      this.crearMarcador( nuevoMarcador.lng, nuevoMarcador.lat);

      this.establecerEventoEnMarcadores(this.indice);

      this.indice++;

      // this.establecerEventoBotonesMarcadores();

    });

    if ( localStorage.getItem('marcadores') ){
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
      if (this.marcadores.length > 0){
        this.crearMarcadoresDeStorage();
      }
    }

  }

  crearMarcador(lng: number, lat: number){

    const popup = new Mapboxgl.Popup({ offset: 25}).setHTML(
      '<strong style="color: black">Titulo</strong>' +
      '<br>' + '<p style="color:black">Lorem ipsum</p>' +
      '<div>' +
        '<button class="btn btn-pink">Editar</button>' +
        '<button class="btn btn-oranje">Borrar</button>' +
      '</div>'
    );

    const marker = new Mapboxgl.Marker({
      draggable: false
      }).setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.mapa);

    this.arrayDeMarcadores.push(marker);
  }


  establecerEventoEnMarcadores(indice: number){

    console.log('Se le agrego evento mouse enter al numero:', indice);
    const marcador: Mapboxgl.Marker = this.arrayDeMarcadores[indice];
    marcador.getElement().addEventListener('mouseenter', () => {
      if (!marcador.getPopup().isOpen()){
        marcador.togglePopup();
      }
    });

    /*
    this.arrayDeMarcadores.forEach((marcador: Mapboxgl.Marker) => {
      marcador.getElement().addEventListener('mouseenter', () => {
       if (!marcador.getPopup().isOpen()){
            marcador.togglePopup();
            this.establecerEventoBotonesMarcadores();
       }
      });
    });*/

  }

  /*establecerEventoBotonesMarcadores(){
    let botonesBorrar = document.getElementsByClassName('btn-oranje');
    console.log(botonesBorrar);
    for (let contador = 0; contador < botonesBorrar.length; contador++){
      if (botonesBorrar.item(contador)){
        botonesBorrar.item(contador).addEventListener('click', () => this.borrar(contador));
      }
    }
  }*/


  guardarStorage(){
    console.log('numero de elemento', this.marcadores.length);
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );
  }

  borrar(i: number){
   /* console.log('hola');
    this.marcadores.splice(i, 1);
    this.guardarStorage();
    console.log(this.arrayDeMarcadores[i]);*/
  }

}
