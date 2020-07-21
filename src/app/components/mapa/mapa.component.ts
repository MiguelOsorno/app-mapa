import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

import * as Mapboxgl from 'mapbox-gl';
import { Marcador } from '../../classes/marcador.class';
import {MatSnackBar} from '@angular/material/snack-bar';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapaEditarComponent } from './mapa-editar.component';

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

  botonesEditar: any = [];

  idBotones = 0;

  seCargoDelStorage = false;

  constructor( private snackBar: MatSnackBar,
               public dialog: MatDialog ) {}


   crearMarcadoresDeStorage = () => {
    let contador = 0;
    this.marcadores.forEach( (marcador) => {
      this.crearMarcador(marcador.lng, marcador.lat, marcador.id, marcador.idBotonEditar, marcador.titulo, marcador.desc);
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
      const nuevoMarcador = new Marcador(e.lngLat.lat, e.lngLat.lng, this.idBotones, this.idBotones );

      this.marcadores.push(nuevoMarcador);

      this.guardarStorage();

      this.crearMarcador( nuevoMarcador.lng,
                          nuevoMarcador.lat,
                          nuevoMarcador.id,
                          nuevoMarcador.idBotonEditar,
                          nuevoMarcador.titulo,
                          nuevoMarcador.desc );

      this.establecerEventoEnMarcadores(this.indice);

      this.idBotones++;
      this.indice++;
    });





  }




  crearMarcador = (lng: number, lat: number, id: number, idboton: string, titulo: string, desc: string, seEdito: boolean = false ) => {

    const popup = new Mapboxgl.Popup({ offset: 25}).setHTML(
      `<strong style="color: black">${ titulo }</strong>` +
      `<br>' + '<p style="color:black">${ desc }</p>` + 
      '<div>' +
        '<button id="' + idboton + '"class="btn btn-pink">Editar</button>' +
        '<button id="' + id + '" class="btn btn-oranje">Borrar</button>' +
      '</div>'
    );

    const marker = new Mapboxgl.Marker({
      draggable: false
      }).setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.mapa);

    if (!seEdito){
      this.arrayDeMarcadores.push(marker);
    }


    if (!this.seCargoDelStorage){
      this.snackBar.open('Marcador agregado', 'cerrar', { duration: 3000 });
    }

    return marker;

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

    this.botonesEditar = document.getElementsByClassName('btn-pink');
    for (let contador = 0; contador < this.botonesEditar.length; contador++){
      if (this.botonesEditar.item(contador)){
        this.botonesEditar.item(contador).addEventListener('click', this.editarMarcador );
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


  editarMarcador = (e) => {

    const id = e.target.id;
    let indice = 0;
    let contador = 0;
    this.marcadores.forEach((marcador) => {
      if (marcador.idBotonEditar == id){
        indice = contador;
      }
      contador++;
    });

    const dialogRef = this.dialog.open(MapaEditarComponent , {
      width: '250px',
      data: {titulo: this.marcadores[indice].titulo , desc: this.marcadores[indice].desc } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (!result){
        return;
      }

      this.marcadores[indice].titulo = result.titulo;
      this.marcadores[indice].desc =  result.desc;

      this.arrayDeMarcadores[indice].remove();

      const nuevoMarcador = this.crearMarcador( this.marcadores[indice].lng,
                          this.marcadores[indice].lat,
                          this.marcadores[indice].id,
                          this.marcadores[indice].idBotonEditar,
                          this.marcadores[indice].titulo,
                          this.marcadores[indice].desc,
                          true);

      this.arrayDeMarcadores[indice] =  nuevoMarcador;

      this.establecerEventoEnMarcadores(indice);

      this.guardarStorage();

      this.snackBar.open('Marcador actualizado', 'cerrar', { duration: 3000 });

    });

  }

}
