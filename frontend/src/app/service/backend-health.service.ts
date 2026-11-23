import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval, timeout, catchError, of } from 'rxjs';

export type BackendConnectionStatus = 'checking' | 'available' | 'retrying' | 'failed';

export interface HealthResponse {
  status: string;
  service?: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendHealthService {
  private readonly healthEndpoint = '/api/health';
  private readonly maxDurationSeconds = 90;
  private readonly retryIntervalSeconds = 5;
  private readonly requestTimeoutMs = 4500;

  // Reactive state signals
  readonly status = signal<BackendConnectionStatus>('checking');
  readonly elapsedSeconds = signal<number>(0);
  readonly retryCount = signal<number>(0);
  readonly errorMessage = signal<string>('');

  // Derived state
  readonly isAvailable = computed(() => this.status() === 'available');
  readonly isConnecting = computed(() => this.status() === 'checking' || this.status() === 'retrying');
  readonly isFailed = computed(() => this.status() === 'failed');
  readonly remainingSeconds = computed(() => Math.max(0, this.maxDurationSeconds - this.elapsedSeconds()));
  readonly progressPercent = computed(() => 
    Math.min(100, Math.round((this.elapsedSeconds() / this.maxDurationSeconds) * 100))
  );

  private timerSubscription: Subscription | null = null;
  private isRequestInFlight = false;
  private hasInitialized = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Initialize the health check and wake-up mechanism.
   * Safe for SSR: on server platforms, it assumes available.
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.status.set('available');
      return;
    }

    if (this.hasInitialized) {
      return;
    }
    this.hasInitialized = true;

    this.checkHealth();
  }

  /**
   * Trigger health check immediately or retry cycle.
   */
  checkHealth(): void {
    if (this.isRequestInFlight) {
      return;
    }

    this.isRequestInFlight = true;

    this.http.get<HealthResponse>(this.healthEndpoint)
      .pipe(
        timeout(this.requestTimeoutMs),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe((res) => {
        this.isRequestInFlight = false;

        if (res && (res.status === 'UP' || res.status === 'ok' || typeof res === 'object')) {
          this.handleSuccess();
        } else {
          this.handleFailure();
        }
      });
  }

  /**
   * Reset the timer and restart the wake-up cycle.
   */
  retry(): void {
    this.stopTimer();
    this.elapsedSeconds.set(0);
    this.retryCount.set(0);
    this.errorMessage.set('');
    this.status.set('checking');
    this.checkHealth();
  }

  private handleSuccess(): void {
    this.stopTimer();
    this.status.set('available');
    this.errorMessage.set('');
  }

  private handleFailure(): void {
    if (this.status() === 'available') {
      return;
    }

    // If already at or beyond 90 seconds, fail immediately
    if (this.elapsedSeconds() >= this.maxDurationSeconds) {
      this.stopTimer();
      this.status.set('failed');
      this.errorMessage.set('Connection to Aadidev Properties cloud server timed out after 90 seconds.');
      return;
    }

    // If not already retrying, start retry countdown and loop
    if (this.status() !== 'retrying') {
      this.status.set('retrying');
      this.startRetryLoop();
    }
  }

  private startRetryLoop(): void {
    this.stopTimer();

    // 1-second interval to update elapsed seconds and fire health check every 5 seconds
    this.timerSubscription = interval(1000).subscribe(() => {
      const currentElapsed = this.elapsedSeconds() + 1;
      this.elapsedSeconds.set(currentElapsed);

      if (currentElapsed >= this.maxDurationSeconds) {
        this.stopTimer();
        this.status.set('failed');
        this.errorMessage.set('Connection to Aadidev Properties cloud server timed out after 90 seconds.');
        return;
      }

      // Check health every 5 seconds
      if (currentElapsed % this.retryIntervalSeconds === 0) {
        this.retryCount.update(c => c + 1);
        this.checkHealth();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}
