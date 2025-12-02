
export interface Object3d{
  id:number,
  name: string,
  category:string,
  description: string,
  imageUrl:string
  typeModel: string,
  isAnimated: boolean
  path?:string,
  positions?: number[][],
  content?: TextForObject3d

}

interface TextForObject3d{
  title:string,
  typeName:string,
  contentCard:TextContent[]
}

//posiciones basadas en clases tailwindCSS
interface TextContent{
  text: string,
  textPosition?: string;
}
