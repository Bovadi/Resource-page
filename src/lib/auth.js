import { supabase } from './supabase.js';

export class AuthManager {
  constructor() {
    this.user = null;
    this.loading = true;
    this.listeners = [];
    this.init();
  }

  async init() {
    const { data: { session } } = await supabase.auth.getSession();
    this.user = session?.user ?? null;
    this.loading = false;
    this.notify();

    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user ?? null;
      this.loading = false;
      this.notify();
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback({
      user: this.user,
      loading: this.loading,
      isAuthenticated: !!this.user
    }));
  }

  async signOut() {
    await supabase.auth.signOut();
  }

  isAuthenticated() {
    return !!this.user;
  }

  getUser() {
    return this.user;
  }

  isLoading() {
    return this.loading;
  }
}

export const authManager = new AuthManager();
