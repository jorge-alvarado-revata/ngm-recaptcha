# NgmRecaptcha

Este proyecto es una implementación en [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9. Para incorporar el uso de Google Recaptcha v2 y v3. Se incluye la invocación de un backend en Node.js para realizar la validación de token de respuesta una vez que se carga el widget
Incluye unas adaptaciones propias de angular para realizar la carga de la función callback de rechaptcha.

Si el captcha no es valido, no se habilita el boton de submit. Este proyecto es util para evitar reintentos automaticos de registro. De acuerdo a la selección de la versión de registro de la clave publica se mostrara el respectivo challenge de captcha.

