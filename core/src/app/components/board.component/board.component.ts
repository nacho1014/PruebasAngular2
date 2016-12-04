import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostIt } from '../../model/post.it';
import { DragulaService } from '../../../../node_modules/ng2-dragula/ng2-dragula';
import { FirebaseService } from '../../services/database/firebase.service';
import { User } from './../../model/user';
import 'rxjs/add/operator/switchMap';
import { DestroySubscribers } from '../../util/unsuscribe.decorator';

@Component({
    selector: 'list',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
    providers: [FirebaseService]

})
@DestroySubscribers()
export class BoardComponent implements OnInit, OnDestroy {

    private todos: PostIt[];
    private inprogress: PostIt[];
    private testing: PostIt[];
    private done: PostIt[];
    private createTask: string;
    private currentUser: User;
    private board: string;
    public subscribers: any = {};




    constructor(private firebaseService: FirebaseService, private dragulaService: DragulaService, private route: ActivatedRoute) {

        this.createTask = 'Añadir tarea';
        this.dragulaSubscriptions(dragulaService);
    }

    /**
     * Metodo que nos gestiona las suscripciones drag & drop de dragula
     */
    private dragulaSubscriptions(dragulaService: DragulaService) {
        this.subscribers.dragulaSubscription = dragulaService.dropModel.subscribe((value) => { this.onDropModel(value.slice(1)) });

    }

    /**
     * Metodo que nos gestiona el drop de elementos, además nos obtiene el id del postIt a mover
     * el contenedor de inicio y el contenedor de destino
     */
    private onDropModel(args) {
        let postItId: string = args[0].id;
        let fromCollection: string = args[2].id;
        let toCollection: string = args[1].id;
        this.addToAnotherBag(postItId, `/${fromCollection}`, `/${toCollection}`);

    }
    /**
     * Metodo que nos gestiona el cambio de columna
     */
    private addToAnotherBag(postItId: string, fromCollection: string, toCollection: string) {

        this.firebaseService.addToOtherBag(this.board, postItId, fromCollection, toCollection, this.currentUser.name);

    }


    /**
     * Metodo que nos gestiona el borrado de notas
     */
    public onNotify(collection: string, key: string) {
        this.firebaseService.delete(key, `boards/${this.board}/${collection}`);
    }




    /**
     * Metodo OnInit que se ejecuta al iniciar el componente
     */
    public ngOnInit() {
        this.suscribeUser();
        this.inicializateRoute();
        this.inicializateCollections();
    }



    /**
     * En este método nos desuscribiremos de los Observers 
     */
    ngOnDestroy() {

        // currently withoutUse

    }

    /**
     * Método en el que obtemos la información sobre el usuario actual 
     */
    private suscribeUser() {
        this.subscribers.userSubscription = this.firebaseService.getCurrentDeveloper().subscribe((user) => {
            this.currentUser = new User(user._name, user._surname, user._email, user._uid);
        });

    }


    /**
     * Metodo que nos obtiene el id del tablero actual a traves de la url
     */
    private inicializateRoute() {
        this.subscribers.routerSubscription = this.route.params
            .switchMap((params: Params) => this.board = params['id'])
            .subscribe((board) => {
            });

    }

    /**
     * Método que nos inicializa los arrays sobre los que se basarán las columnas del tablero
     * estos se suscriben a listas observables que nos vienen desde Firebase
     * 
     */
    private inicializateCollections() {


        this.subscribers.subscription = this.firebaseService.getCollection(`boards/${this.board}/_todo`).subscribe(
            (items) => this.todos = items
        );

        this.subscribers.subscription2 = this.firebaseService.getCollection(`boards/${this.board}/_inprogress`).subscribe(
            (items) => this.inprogress = items
        );
        this.subscribers.subscription3 = this.firebaseService.getCollection(`boards/${this.board}/_testing`).subscribe(
            (items) => this.testing = items
        );
        this.subscribers.subscription4 = this.firebaseService.getCollection(`boards/${this.board}/_done`).subscribe(
            (items) => this.done = items
        );


    }

}

