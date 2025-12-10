import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../interfaces/news.interface';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'individual-new-page',
  imports: [DatePipe],
  templateUrl: './individual-new-page.component.html',
})
export default class IndividualNewPageComponent implements OnInit{
  //Servicios
  newsService = inject(NewsService);
  route = inject(ActivatedRoute);

  //Atributos
  idRoute = signal<number | null>(null);
  newsDataGetter = computed<News | null >(()=>{
    if(!this.newsService.newsResource.value() && !this.idRoute()){
      return null;
    }
    return this.newsService.getNewById(this.newsService.newsResource.value()!,this.idRoute()!);
  })


  //Lyfecyclehooks
  ngOnInit(): void {
    this.idRoute.set(parseInt(this.route.snapshot.paramMap.get("id")!));
  }


}
