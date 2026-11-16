import type { Product } from "@/types/product";

// Importamos las imágenes desde la carpeta de assets
import imgAnillos from '@/assets/images/joyeria/anillos.jpeg';
import imgCollar1 from '@/assets/images/joyeria/collar1.jpeg';
import imgCollares from '@/assets/images/joyeria/collares.jpeg';
import imgCollaresDisplay from '@/assets/images/joyeria/collares_display.jpg';
import imgMonoPuesto from '@/assets/images/joyeria/mono_puesto.jpg';
import imgMonos from '@/assets/images/joyeria/monos.jpeg';
import imgPulsera from '@/assets/images/joyeria/pulsera.jpeg';

export const productos: Product[] = [
    {
        id: 1,
        nombre: 'Aretes de corazon',
        precio: 80,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Aretes',
        material: 'acero inoxidable',
        imagenes: [
            imgMonoPuesto, 
            imgMonos
        ]
    },
    {
        id: 2,
        nombre: 'Collar de perlas',
        precio: 100,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Collares',
        material: 'perlas',
        imagenes: [
            imgCollar1
        ]
    },
    {
        id: 3,
        nombre: 'Pulsera de cristal',
        precio: 50,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Pulseras',
        material: 'cristales',
        imagenes: [
            imgPulsera
        ]
    },
    {
        id: 4,
        nombre: 'Anillo de concha',
        precio: 90,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Anillos',
        material: 'acero inoxidable',
        imagenes: [
            imgAnillos
        ]
    },
    {
        id: 5,
        nombre: 'Aretes',
        precio: 80,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Aretes',
        material: 'acero inoxidable',
        imagenes: [
            imgMonos
        ]
    },
    {
        id: 6,
        nombre: 'Collar',
        precio: 100,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Collares',
        material: 'perlas',
        imagenes: [
            imgCollares,
            imgCollaresDisplay
        ]
    },
    {
        id: 7,
        nombre: 'Pulsera',
        precio: 50,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Pulseras',
        material: 'cristales',
        imagenes: [
            imgPulsera
        ]
    },
    {
        id: 8,
        nombre: 'Anillo',
        precio: 90,
        descripcion: 'Lindos anillos de metal',
        categoria: 'Anillos',
        material: 'acero inoxidable',
        imagenes: [
            imgAnillos
        ]
    },
];