import { api } from '@/services/api';
import { storage } from '@/utils/storage';

export const testConnection = async () => {
  try {
    // 1. Login manual para obtener tokens
    const loginRes = await api.post('/auth/login/', {
      email: 'admin@example.com',
      password: 'admin1234',
    });

    const { access, refresh } = loginRes.data;
    await storage.saveTokens(access, refresh);
    console.log('✅ Tokens guardados');

    // 2. Petición autenticada con el interceptor
    const meRes = await api.get('/auth/me/');
    console.log('✅ Usuario autenticado:', meRes.data);

    // 3. Petición pública (funciona sin token)
    const productsRes = await api.get('/products/');
    console.log('✅ Productos:', productsRes.data);

    // 4. Petición con query params (paginación)
    const paginatedRes = await api.get('/products/?page=1&page_size=3');
    console.log('✅ Paginación:', {
      count: paginatedRes.data.count,
      resultsLength: paginatedRes.data.results.length,
    });

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};