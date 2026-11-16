export function formatPrice(precio: number): string{
   return precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }); 
}