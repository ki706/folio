// lib/types.ts

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  stack: string[];
  status: 'active' | 'completed' | 'paused';
  learned: string;
  achievement: string;
  draft_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content_linkedin: string;
  content_x: string[];
  tone: 'builder' | 'hustler' | 'hot_take';
  project_id: string | null;
  project_name: string | null;
  is_saved: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'inactivity' | 'trending' | 'new_project' | 'streak' | 'commit';
  message: string;
  cta_label: string;
  cta_action: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  name: string;
  title: string;
  years_exp: string;
  location: string;
  goal: 'hired' | 'freelance' | 'both';
  voice_description: string;
  writing_samples: string[];
  stack: string[];
  linkedin_url: string;
  x_handle: string;
  github_url: string;
  github_token: string;
  tracked_repos: string[];
  webhook_secret: string;
  inactivity_days: number;
  proactive_trending: boolean;
  proactive_new_project: boolean;
  proactive_inactivity: boolean;
  onboarding_completed: boolean;
}
