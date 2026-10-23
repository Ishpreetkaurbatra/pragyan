import { 
  Profile, 
  Business, 
  Trend, 
  TrendMetric, 
  Audience, 
  GeographicSignal, 
  Opportunity, 
  ActionPlan, 
  ExpertReview, 
  Experiment, 
  Alert, 
  DashboardData,
  AskTGoResponse,
  UserRole
} from '../../types';

class ApiClient {
  private activeRole: UserRole = 'BUSINESS';

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
    localStorage.setItem('tg_active_role', role);
  }

  public getActiveRole(): UserRole {
    const saved = localStorage.getItem('tg_active_role') as UserRole;
    if (saved) this.activeRole = saved;
    return this.activeRole;
  }

  private getApiUrl(endpoint: string): string {
    const rawBase = (
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
      (import.meta.env.VITE_API_URL as string | undefined) ||
      ''
    ).trim();

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    if (!rawBase) {
      // In local development or when VITE_API_BASE_URL is not set, use relative /api
      return `/api${cleanEndpoint}`;
    }

    const normalizedBase = rawBase.replace(/\/+$/, '');
    if (!normalizedBase.endsWith('/api')) {
      return `${normalizedBase}/api${cleanEndpoint}`;
    }
    return `${normalizedBase}${cleanEndpoint}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'x-demo-role': this.getActiveRole(),
      ...(options.headers || {}),
    };

    const url = this.getApiUrl(endpoint);

    let res: Response;
    try {
      res = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkErr: unknown) {
      const errMessage = networkErr instanceof Error ? networkErr.message : String(networkErr);
      console.error(`[API Network Error] ${options.method || 'GET'} ${url}:`, errMessage);
      throw new Error('Backend unavailable. Please check the T→G server connection.');
    }

    // Inspect Content-Type header before attempting JSON parsing
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const isJson = contentType.includes('application/json') || contentType.includes('application/problem+json');

    if (!isJson) {
      let rawSnippet = '';
      try {
        const text = await res.text();
        rawSnippet = text.slice(0, 150).trim();
      } catch {
        // ignore read error
      }
      console.error(
        `[API Error] Received non-JSON response (${res.status} ${res.statusText}, Content-Type: ${contentType}) from ${url}:`,
        rawSnippet
      );
      throw new Error('Backend unavailable. Please check the T→G server connection.');
    }

    let json: any;
    try {
      json = await res.json();
    } catch (parseErr) {
      console.error(`[API Parse Error] Failed to parse JSON from ${url}:`, parseErr);
      throw new Error('Backend unavailable. Please check the T→G server connection.');
    }

    if (!res.ok || json.success === false) {
      const msg = json.error?.message || `HTTP ${res.status} Error: ${res.statusText || 'Request failed'}`;
      throw new Error(msg);
    }

    return (json.data !== undefined ? json.data : json) as T;
  }

  // --- Auth ---
  public async getMe(): Promise<{ user: Profile; business: Business }> {
    return this.request('/auth/me');
  }

  public async login(email: string, role?: UserRole): Promise<{ token: string; user: Profile }> {
    const res = await this.request<{ token: string; user: Profile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role: role || this.getActiveRole() }),
    });
    if (res.user?.role) {
      this.setActiveRole(res.user.role as UserRole);
    }
    return res;
  }

  public async register(data: { email: string; fullName: string; role?: UserRole }): Promise<{ token: string; user: Profile }> {
    const res = await this.request<{ token: string; user: Profile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.user?.role) {
      this.setActiveRole(res.user.role as UserRole);
    }
    return res;
  }

  public async switchRole(role: UserRole): Promise<{ token: string; user: Profile }> {
    this.setActiveRole(role);
    return this.request('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  // --- Business Profile ---
  public async getBusinessProfile(): Promise<{ profile: Profile; business: Business }> {
    return this.request('/business/profile');
  }

  public async updateBusinessProfile(data: Partial<Business>): Promise<Business> {
    return this.request('/business/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- Dashboard ---
  public async getDashboard(businessId?: string): Promise<DashboardData> {
    const query = businessId ? `?businessId=${businessId}` : '';
    return this.request(`/dashboard${query}`);
  }

  // --- Trends ---
  public async getTrends(params?: { category?: string; search?: string; status?: string }): Promise<Trend[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All' && params.category !== 'For You') query.append('category', params.category);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/trends${qs}`);
  }

  public async getTrendById(id: string): Promise<Trend> {
    return this.request(`/trends/${id}`);
  }

  public async getTrendMetrics(id: string, period?: string): Promise<TrendMetric[]> {
    const qs = period ? `?period=${period}` : '';
    return this.request(`/trends/${id}/metrics${qs}`);
  }

  public async getTrendAudience(id: string): Promise<Audience[]> {
    return this.request(`/trends/${id}/audience`);
  }

  public async getTrendGeography(id: string): Promise<GeographicSignal[]> {
    return this.request(`/trends/${id}/geography`);
  }

  public async getSources(): Promise<any[]> {
    return this.request('/trends/sources');
  }

  public async saveTrend(id: string): Promise<{ saved: boolean }> {
    return this.request(`/trends/${id}/save`, { method: 'POST' });
  }

  public async unsaveTrend(id: string): Promise<{ saved: boolean }> {
    return this.request(`/trends/${id}/save`, { method: 'DELETE' });
  }

  public async getSavedTrends(): Promise<Trend[]> {
    return this.request('/trends/saved');
  }

  // --- Opportunities ---
  public async getOpportunities(businessId?: string): Promise<Opportunity[]> {
    const qs = businessId ? `?businessId=${businessId}` : '';
    return this.request(`/opportunities${qs}`);
  }

  public async generateOpportunity(businessId: string, trendId: string): Promise<Opportunity> {
    return this.request('/opportunities/generate', {
      method: 'POST',
      body: JSON.stringify({ businessId, trendId }),
    });
  }

  // --- Action Plans ---
  public async getActionPlans(businessId?: string): Promise<ActionPlan[]> {
    const qs = businessId ? `?businessId=${businessId}` : '';
    return this.request(`/action-plans${qs}`);
  }

  public async generateActionPlan(businessId: string, trendId: string, opportunityId?: string): Promise<ActionPlan> {
    return this.request('/action-plans/generate', {
      method: 'POST',
      body: JSON.stringify({ businessId, trendId, opportunityId }),
    });
  }

  public async submitActionPlanForReview(id: string): Promise<ActionPlan> {
    return this.request(`/action-plans/${id}/submit`, { method: 'POST' });
  }

  // --- Expert Reviews ---
  public async getExpertReviews(status?: string): Promise<ExpertReview[]> {
    const qs = status ? `?status=${status}` : '';
    return this.request(`/expert/reviews${qs}`);
  }

  public async approveReview(id: string, comments?: string, suggestedChanges?: string): Promise<ExpertReview> {
    return this.request(`/expert/reviews/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments, suggestedChanges }),
    });
  }

  public async requestChangesReview(id: string, comments: string, suggestedChanges: string): Promise<ExpertReview> {
    return this.request(`/expert/reviews/${id}/request-changes`, {
      method: 'POST',
      body: JSON.stringify({ comments, suggestedChanges }),
    });
  }

  public async rejectReview(id: string, comments: string, decisionReason: string): Promise<ExpertReview> {
    return this.request(`/expert/reviews/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ comments, decisionReason }),
    });
  }

  // --- Experiments ---
  public async getExperiments(businessId?: string): Promise<Experiment[]> {
    const qs = businessId ? `?businessId=${businessId}` : '';
    return this.request(`/experiments${qs}`);
  }

  public async createExperiment(data: Partial<Experiment>): Promise<Experiment> {
    return this.request('/experiments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async addExperimentMetric(experimentId: string, metric: { metric_name: string; metric_value: number; metric_unit?: string }): Promise<any> {
    return this.request(`/experiments/${experimentId}/metrics`, {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  }

  public async completeExperiment(id: string, decision: string, outcome?: any): Promise<Experiment> {
    return this.request(`/experiments/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ decision, outcome }),
    });
  }

  // --- Alerts ---
  public async getAlerts(unreadOnly?: boolean): Promise<Alert[]> {
    const qs = unreadOnly ? '?unread=true' : '';
    return this.request(`/alerts${qs}`);
  }

  public async markAlertRead(id: string): Promise<any> {
    return this.request(`/alerts/${id}/read`, { method: 'POST' });
  }

  // --- Ask T→G ---
  public async askTG(question: string, businessId?: string): Promise<AskTGoResponse> {
    const res = await this.request<any>('/ask-tg', {
      method: 'POST',
      body: JSON.stringify({ question, businessId }),
    });
    return res.data || res;
  }

  // --- Admin ---
  public async getAdminOverview(): Promise<any> {
    return this.request('/admin/overview');
  }

  // --- Intelligence Provider Switcher ---
  public async getIntelligenceMode(): Promise<{ mode: string }> {
    return this.request('/intelligence/mode');
  }

  public async setIntelligenceMode(mode: string): Promise<{ mode: string }> {
    return this.request('/intelligence/mode', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
  }
}

export const api = new ApiClient();
