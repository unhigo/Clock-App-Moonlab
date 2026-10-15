export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  static sendNotification(title: string, body: string): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg'
      });
    } catch (e) {
      console.warn('Failed to send notification', e);
    }
  }

  static triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light'): void {
    if (!('vibrate' in navigator)) return;
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(20);
          break;
        case 'medium':
          navigator.vibrate(40);
          break;
        case 'success':
          navigator.vibrate([30, 60, 40]);
          break;
        case 'warning':
          navigator.vibrate([50, 100, 50, 100]);
          break;
      }
    } catch {}
  }

  static updateDocumentTitle(prefix?: string): void {
    if (prefix) {
      document.title = `${prefix} — Time Studio`;
    } else {
      document.title = 'Time Studio';
    }
  }
}
