# NightEye

Esta es una aplicación de inicio de sesión desarrollada con React Native y Firebase. La aplicación permite a los usuarios crear una cuenta, iniciar sesión y navegar entre diferentes pantallas utilizando `expo-router`.
Ademas su funcionalidad principal es poder reportar actos de delincuencia en las distintas zonas de una ciudad, en este caso Bogota.

## Características

- Crear una cuenta de usuario
- Iniciar sesión con una cuenta existente
- Navegación entre pantallas utilizando `expo-router`
- Integración con Firebase para autenticación y base de datos
- Uso de Tailwind CSS para estilos
- Uso de los mapas nativos de cada dispositivo y su navegación.

## Requisitos

- Node.js
- Expo CLI
- Firebase cuenta y configuración

## Instalación

1. Clona el repositorio:

```sh
git clone https://github.com/tu-usuario/log-in-app.git
cd log-in-app

npm install
```

## Configuracion Firebase
- En el proyecto se evidencia un Firebase-config.js, aqui se usa la configuracion del proyecto creado en firebase, lo que nos permite hacer uso tanto del storage, la db en tiempo real y la autenticación. 

## Uso

#### - Crear una Cuenta
Abre la aplicación.
Ingresa tu correo electrónico y contraseña.
Haz clic en "Create Account".

#### - Iniciar Sesión
Abre la aplicación.
Ingresa tu correo electrónico y contraseña.
Haz clic en "Login".

#### - Navegación
Usa las pestañas en la parte inferior para navegar entre las pantallas de "Mapa" e "Info usuario".
En la pantalla de "Mapa", puedes ver las localidades y reportar incidentes.


