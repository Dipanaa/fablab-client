import { Pipe, PipeTransform } from '@angular/core';
import { Object3d } from '../interfaces/objects3d.interface';
import { noSpaceString } from '../utils/stringFunctions/noSpaceString.function';

@Pipe({
    name: 'categoryFilter'
})

export class CategoryFilterPipe implements PipeTransform {
    transform(value: Object3d[], category?: string): Object3d[]{

      if(category === "todas"){
        return value;
      }

      if(!value || !category){
          return [];
      }


      return value.filter((element)=>noSpaceString(element.category) === category);
    }
}
