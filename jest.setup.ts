import '@testing-library/jest-dom';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';

process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key';



class ResizeObserver {

  observe() {}

  unobserve() {}

  disconnect() {}

}



window.ResizeObserver = ResizeObserver;
