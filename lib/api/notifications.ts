// lib/api/notifications.ts
import { supabase } from '../supabase';
import { Notification } from '../types';
import { isDemoMode, getCurrentUser } from '../auth-helpers';

export async function getNotifications(): Promise<Notification[]> {
  try {
    if (await isDemoMode()) {
      return [
        {
          id: '1', type: 'streak', message: '🔥 12-day posting streak! Your brand signal is reaching peak resonance.',
          cta_label: 'View Stats', cta_action: '/', is_read: false, created_at: new Date().toISOString()
        },
        {
          id: '2', type: 'trending', message: '⌥ New trend detected: "AI Agents". Ready to synthesize a perspective?',
          cta_label: 'Draft Post', cta_action: '/generate', is_read: false, created_at: new Date().toISOString()
        }
      ] as any[];
    }
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications_portemitto')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('getNotifications Error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getNotifications Exception:', err);
    return [];
  }
}

export async function addNotification(n: Omit<Notification, 'id' | 'created_at' | 'user_id'>): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from('notifications_portemitto').insert([{ ...n, user_id: user.id }]);
    if (error) {
      console.error('Add Notification Error:', error);
      throw new Error('Alert delivery failed.');
    }
  } catch (err) {
    console.error('addNotification Exception:', err);
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from('notifications_portemitto').update({ is_read: true }).eq('id', id).eq('user_id', user.id);
    if (error) {
      console.error('Mark Notification Read Error:', error);
      throw new Error('Signal status update failed.');
    }
  } catch (err) {
    console.error('markNotificationRead Exception:', err);
  }
}

export async function dismissNotification(id: string): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from('notifications_portemitto').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      console.error('Dismiss Notification Error:', error);
      throw new Error('Alert erasure protocol failed.');
    }
  } catch (err) {
    console.error('dismissNotification Exception:', err);
  }
}
