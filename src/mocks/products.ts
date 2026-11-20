import type { Product } from "@/types/product";

// Importamos las imágenes desde la carpeta de assets
import imgAnillos from '@/assets/images/joyeria/anillos.jpeg';
import imgCollar1 from '@/assets/images/joyeria/collar1.jpeg';
import imgCollares from '@/assets/images/joyeria/collares.jpeg';
import imgCollaresDisplay from '@/assets/images/joyeria/collares_display.jpg';
import imgMonoPuesto from '@/assets/images/joyeria/mono_puesto.jpg';
import imgMonos from '@/assets/images/joyeria/monos.jpeg';
import imgPulsera from '@/assets/images/joyeria/pulsera.jpeg';

export const products: Product[] = [
    {
        id: 1,
        name: 'Aretes de corazon',
        price: 80,
        description: 'Lindos anillos de metal',
        category: 'Aretes',
        material: 'acero inoxidable',
        images: [
            imgMonoPuesto, 
            imgMonos
        ]
    },
    {
        id: 2,
        name: 'Collar de perlas',
        price: 100,
        description: 'Lindos anillos de metal',
        category: 'Collares',
        material: 'perlas',
        images: [
            imgCollar1
        ]
    },
    {
        id: 3,
        name: 'Pulsera de cristal',
        price: 50,
        description: 'Lindos anillos de metal',
        category: 'Pulseras',
        material: 'cristales',
        images: [
            imgPulsera
        ]
    },
    {
        id: 4,
        name: 'Anillo de concha',
        price: 90,
        description: 'Lindos anillos de metal',
        category: 'Anillos',
        material: 'acero inoxidable',
        images: [
            imgAnillos
        ]
    },
    {
        id: 5,
        name: 'Aretes',
        price: 80,
        description: 'Lindos anillos de metal',
        category: 'Aretes',
        material: 'acero inoxidable',
        images: [
            imgMonos
        ]
    },
    {
        id: 6,
        name: 'Collar',
        price: 100,
        description: 'Lindos anillos de metal',
        category: 'Collares',
        material: 'perlas',
        images: [
            imgCollares,
            imgCollaresDisplay
        ]
    },
    {
        id: 7,
        name: 'Pulsera',
        price: 50,
        description: 'Lindos anillos de metal',
        category: 'Pulseras',
        material: 'cristales',
        images: [
            imgPulsera
        ]
    },
    {
        id: 8,
        name: 'Anillo',
        price: 90,
        description: 'Lindos anillos de metal',
        category: 'Anillos',
        material: 'acero inoxidable',
        images: [
            imgAnillos
        ]
    },
];