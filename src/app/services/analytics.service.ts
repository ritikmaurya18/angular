import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  logEvent(action: string, category: string, label?: string): void {
    if (environment.enableAnalytics) {
      console.log(`[Analytics] ${category} | ${action}${label ? ` | ${label}` : ''}`);
    }
  }
}
