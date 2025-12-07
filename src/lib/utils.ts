// Format date to readable format
export function formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    
    // Format date for input field (YYYY-MM-DD)
    export function formatDateForInput(dateString: string): string {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }
    
    // Truncate text to certain length
    export function truncateText(text: string, length: number): string {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    }
    
    // Check if user is authenticated
    export function isAuthenticated(): boolean {
      if (typeof window === 'undefined') return false;
      return !!localStorage.getItem('authToken');
    }
    
    // Get stored user
    export function getStoredUser() {
      if (typeof window === 'undefined') return null;
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    
    // Get stored token
    export function getStoredToken(): string | null {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('authToken');
    }
    
    // Clear auth data
    export function clearAuthData(): void {
      if (typeof window === 'undefined') return;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }