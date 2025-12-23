import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing from environment variables. Please check your .env file.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing from environment variables. Please check your .env file.');
}

try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please verify your VITE_SUPABASE_URL in the .env file.`);
}

if (!supabaseUrl.includes('.supabase.co')) {
  console.warn('Warning: Supabase URL does not appear to be a valid Supabase project URL. Expected format: https://your-project.supabase.co');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const checkSupabaseConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 404) {
        return { connected: true };
      } else if (response.status === 401) {
        return { connected: false, error: 'Invalid API key. Please check your VITE_SUPABASE_ANON_KEY in the .env file.' };
      } else {
        return { connected: false, error: `Supabase server responded with status ${response.status}. Please verify your project is active.` };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return { connected: false, error: 'Connection timeout. Please check your internet connection and Supabase project status.' };
        }
        if (fetchError.message.includes('Failed to fetch')) {
          return { connected: false, error: 'Unable to reach Supabase. Please verify your VITE_SUPABASE_URL and internet connection.' };
        }
      }
      throw fetchError;
    }
  } catch (error) {
    let errorMessage = 'Unknown connection error';

    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network connection failed. Please check:\n1. Your internet connection\n2. Your Supabase project URL in .env file\n3. That your Supabase project is active';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error. Please check your Supabase project configuration.';
      } else {
        errorMessage = error.message;
      }
    }

    return { connected: false, error: errorMessage };
  }
};

export const handleSupabaseError = (error, operation) => {
  console.error(`Supabase ${operation} error:`, error);

  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return new Error(`Network connection failed. Please check your internet connection and try again. If the problem persists, the Supabase service may be temporarily unavailable.`);
  }

  if (error.message?.includes('CORS')) {
    return new Error(`Cross-origin request blocked. Please check your Supabase project configuration.`);
  }

  if (error.message?.includes('JWT') || error.message?.includes('auth')) {
    return new Error(`Authentication error: ${error.message}`);
  }

  if (error.code === '42501' || error.message?.includes('policy')) {
    return new Error(`Access denied. Please check your database permissions.`);
  }

  if (error.message) {
    return new Error(`Database error: ${error.message}`);
  }

  return new Error(`Failed to ${operation}: ${error.toString()}`);
};
