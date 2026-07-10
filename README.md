# App de Asistencia

Aplicación diseñada para la gestión y registro eficiente de asistencia, construida con un enfoque multiplataforma y una arquitectura escalable.

##  Stack Tecnológico

*   **Frontend:** React, Ionic Framework, Vite
*   **Lenguaje:** TypeScript
*   **Gestión de Estado:** Zustand / Context API

---

## 1. Instrucciones de Instalación

Para ejecutar este proyecto en tu entorno local, asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada).

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/luievazquezg30/app_asistencia.git
2. **Navegar a la carpeta:**
   ```bash
   cd app-asistencia 
3. **Instalar dependencias:**
   ```bash
   npm install
4. **Previsualizar como app móvil:**
   ```bash
   ionic serve
   
## 2. Decisiones Técnicas

*   **React + Vite:** Se seleccionó **Vite** por su velocidad de compilación y gestión eficiente de módulos, optimizando significativamente la experiencia de desarrollo.
*   **Ionic Framework:** Permite mantener un código base único para iOS y Android, aprovechando componentes de interfaz nativos y una experiencia de usuario consistente.
*   **TypeScript:** Implementado para garantizar la seguridad de tipos, reducir errores en tiempo de ejecución y mejorar la mantenibilidad del código a largo plazo.
*   **Gestión de Estado:** Se implementó una solución centralizada (**Zustand / Context API**) para manejar los datos de sesión y el estado de la asistencia. Este diseño desacoplado facilita la futura integración con fuentes de datos dinámicas o APIs externas.
