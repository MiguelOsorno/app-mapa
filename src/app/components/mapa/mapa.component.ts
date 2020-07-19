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

  marcadores: Marcador[] = [];

  arrayDeMarcadores: Mapboxgl.Marker[] = [];

  mapa: Mapboxgl.Map;

  constructor() { }

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

      this.crearMarcador( nuevoMarcador.lng, nuevoMarcador.lat);

      this.marcadores.forEach((marcador) => {
        this.establecerEventoEnMarcadores();
      });
    });
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


  establecerEventoEnMarcadores(){
    let contador = 0;
    this.arrayDeMarcadores.forEach((marcador: Mapboxgl.Marker) => {
      contador++;
      marcador.getElement().addEventListener('mouseenter', () => {
       if (!marcador.getPopup().isOpen()){
            marcador.togglePopup();
       }
      });
    });
  }

}
