import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of,  } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { News } from '../interfaces/news.interface';
import { newsMapperApiToNewsArray } from '../utils/mappers/newsMapper';
import { NewsResponseInterface } from '../utils/responseInterfaces/newsResponse';

@Injectable({providedIn: 'root'})
export class NewsService{

  //Servicios
  private httpclient = inject(HttpClient);

  //Atributos
  newsResponse = signal<News[]>([]);

  //Carga de noticias señal
  newsLoading = signal<boolean>(false);
  errorHandler = signal<string | undefined>(undefined);


  //TODO: Arreglar valor recurso
  //Recurso reactivo
  newsResource = rxResource({
    loader: () => {
      return this.getNews();
    }
  });

  //Metodos
  getNews(): Observable<News[] | null>{
    return this.httpclient.get<NewsResponseInterface[]>("https://fablabwebapi20251104221404-crbeb0b9cafvhqg3.canadacentral-01.azurewebsites.net/api/noticias/noticiasestado").pipe(
      map((resp)=>{
        return newsMapperApiToNewsArray(resp);
      }),
      catchError((err)=>{
        return of(null);
      })
    );
  }

  getNewById(newsArray: News[], id: number): News | null{
    if(!newsArray){
      return null;
    }

    return newsArray.find((news) => news.id == id)!;
  }




}
