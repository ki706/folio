-- Emitto Database Schema (Standardized)
-- Paste this into your Supabase SQL Editor

-- 1. Create Settings table
CREATE TABLE IF NOT EXISTS public."EmittoSettings" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT DEFAULT '',
    title TEXT DEFAULT '',
    years_exp TEXT DEFAULT '',
    location TEXT DEFAULT '',
    goal TEXT DEFAULT 'both',
    voice_description TEXT DEFAULT '',
    writing_samples TEXT[] DEFAULT '{}',
    stack TEXT[] DEFAULT '{}',
    linkedin_url TEXT DEFAULT '',
    x_handle TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    github_token TEXT DEFAULT '',
    tracked_repos TEXT[] DEFAULT '{}',
    webhook_secret TEXT DEFAULT '',
    inactivity_days INTEGER DEFAULT 3,
    proactive_trending BOOLEAN DEFAULT TRUE,
    proactive_new_project BOOLEAN DEFAULT TRUE,
    proactive_inactivity BOOLEAN DEFAULT TRUE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Projects table
CREATE TABLE IF NOT EXISTS public."EmittoProjects" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    stack TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    learned TEXT DEFAULT '',
    achievement TEXT DEFAULT '',
    draft_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Posts table
CREATE TABLE IF NOT EXISTS public."EmittoPosts" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_linkedin TEXT DEFAULT '',
    content_x TEXT[] DEFAULT '{}',
    tone TEXT DEFAULT 'builder',
    project_id UUID REFERENCES public."EmittoProjects"(id) ON DELETE SET NULL,
    project_name TEXT DEFAULT '',
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Notifications table
CREATE TABLE IF NOT EXISTS public."EmittoNotifications" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'commit',
    message TEXT DEFAULT '',
    cta_label TEXT DEFAULT '',
    cta_action TEXT DEFAULT '/',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS (Row Level Security)
ALTER TABLE public."EmittoSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EmittoProjects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EmittoPosts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EmittoNotifications" ENABLE ROW LEVEL SECURITY;

-- POLICIES for EmittoSettings
CREATE POLICY "Users can view their own settings" ON public."EmittoSettings" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public."EmittoSettings" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public."EmittoSettings" FOR UPDATE USING (auth.uid() = user_id);

-- POLICIES for EmittoProjects
CREATE POLICY "Users can view their own projects" ON public."EmittoProjects" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON public."EmittoProjects" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public."EmittoProjects" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public."EmittoProjects" FOR DELETE USING (auth.uid() = user_id);

-- POLICIES for EmittoPosts
CREATE POLICY "Users can view their own posts" ON public."EmittoPosts" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own posts" ON public."EmittoPosts" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public."EmittoPosts" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public."EmittoPosts" FOR DELETE USING (auth.uid() = user_id);

-- POLICIES for EmittoNotifications
CREATE POLICY "Users can view their own notifications" ON public."EmittoNotifications" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notifications" ON public."EmittoNotifications" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public."EmittoNotifications" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public."EmittoNotifications" FOR DELETE USING (auth.uid() = user_id);
