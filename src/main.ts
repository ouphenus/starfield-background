import {OuphenusStarField} from "./ouphenus-starfield.js"

// Creando el Campo de estrellas
let starfield = new OuphenusStarField.Main();

// Seteando las imágenes para las estrellas
OuphenusStarField.Star.setupStarsImages( new Array<string>(
    'images/star_white.png',
    'images/star_red.png',
    'images/star_blue.png',
    'images/star_yellow.png')
)

// Añadiendo Banner StartWars (solo de ejemplo)
starfield.createBanner();

