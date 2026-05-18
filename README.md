# 🚀 FabLab INACAP Maipú - Cliente (Landing Page)

Bienvenido al repositorio oficial del **Cliente Web (Landing Page)** para el sistema de gestión integral del FabLab INACAP Maipú. Este módulo está diseñado para dar visibilidad a las capacidades del laboratorio, exhibir proyectos destacados y atraer nuevos estudiantes de la sede, centralizando el acceso a la información.

## 🛠️ Stack Tecnológico
* **Framework:** Angular 19
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS 4.0
* **Modelado 3D:** Three.js

## 📐 Arquitectura y Patrones de Diseño
* **Arquitectura N-Capas (Capa de Presentación):** Actúa como el FrontEnd principal desacoplado de la lógica de negocio, comunicándose exclusivamente a través de la API RESTful.
* **Patrón MVVM:** Organización jerárquica propia de Angular utilizando componentes estructurados, plantillas HTML y clases lógicas en TypeScript.
* **Inyección de Dependencias (DI) y Singleton:** Utilización de servicios inyectables (ej. `NewsService`, `ProjectsService`) que mantienen un estado global y aíslan la lógica de obtención de datos de la capa visual.
* **Patrón Observer y Programación Reactiva:** Uso intensivo de **RxJS** (Observables) y *Signals* para manejar asincronía y el flujo de datos de respuestas HTTP (peticiones GET) de forma fluida y sin recargas de página.

## ⚙️ Principales Implementaciones
* **Tours 3D Interactivos:** Integración nativa con `Three.js` (incluyendo `STLLoader`) para renderizar modelos tridimensionales interactivos de la maquinaria del FabLab (ej. Impresoras 3D, Cortadoras Láser). Esto permite a los usuarios pre-visualizar el equipamiento en 360° desde el navegador.
* **Visualización Dinámica de Proyectos y Noticias:** Consumo directo de la Web API del sistema para listar de forma asíncrona artículos, eventos y proyectos más relevantes generados en el laboratorio, con estado de carga (Loaders visuales) incorporado.
* **Filtros Personalizados:** Implementación de _Pipes_ para facilitar la búsqueda en tiempo real por nombre de proyecto o categoría de aplicación.
* **UI/UX Responsiva y Adaptativa:** Construcción mediante un modelo web jerárquico adaptativo y arquitectura *Single Page Application (SPA)*, garantizando una experiencia óptima tanto en computadores como en dispositivos móviles.

## 📋 Metodología y Calidad
* **Metodología Ágil:** Gestión y flujo de desarrollo continuo liderado a través de metodología Kanban.
* **Aseguramiento de Calidad (QA):** Implementación de robustas pruebas funcionales (Caja Blanca y Caja Negra) sobre componentes clave, validando la interacción del DOM y respuestas asíncronas de la API.
## Imagenes destacadas

<img width="1017" height="513" alt="image" src="https://github.com/user-attachments/assets/1cb8e825-9eb9-4894-8069-6ade05c37ce4" />

<img width="1016" height="509" alt="image" src="https://github.com/user-attachments/assets/8e975322-d5f3-4936-b56b-1a493c306622" />

<img width="1017" height="506" alt="image" src="https://github.com/user-attachments/assets/4850ad57-2a5e-406f-9669-547a0c5eb860" />
