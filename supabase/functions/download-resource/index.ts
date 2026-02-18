/*
  # Download Resource Endpoint

  1. New Tables
    - `download_logs` - Track download attempts and statistics
    - Updates to `content` table to include download_url field

  2. Security
    - URL validation and sanitization
    - Domain whitelist checking
    - File type validation
    - User authentication required
    - CORS restricted to APP_ORIGIN env var (no wildcard on authenticated endpoints)

  3. Features
    - Download statistics tracking
    - Proper error handling
    - Content-Disposition headers for downloads
*/

import { createClient } from 'npm:@supabase/supabase-js@2'

const ALLOWED_ORIGIN = Deno.env.get('APP_ORIGIN') ?? '';

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN ? origin : '';
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

const ALLOWED_DOMAINS = [
  'cdn.shopify.com',
  'drive.google.com',
  'dropbox.com',
  'amazonaws.com',
  'supabase.co',
  'github.com',
  'githubusercontent.com'
];

const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.zip', '.rar', '.7z', '.tar', '.gz',
  '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
  '.mp4', '.avi', '.mov', '.wmv', '.flv',
  '.mp3', '.wav', '.flac', '.aac',
  '.txt', '.csv', '.json', '.xml'
];

interface DownloadRequest {
  resource_id: string;
  user_id?: string;
}

interface CreateResourceRequest {
  title: string;
  description?: string;
  download_url: string;
  category_id?: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'POST' && path.endsWith('/create')) {
      return await handleCreateResource(req, supabase, corsHeaders);
    }

    if (req.method === 'POST' && path.endsWith('/download')) {
      return await handleDownload(req, supabase, corsHeaders);
    }

    if (req.method === 'GET' && path.endsWith('/stats')) {
      return await handleGetStats(req, supabase, corsHeaders);
    }

    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});

async function handleCreateResource(req: Request, supabase: any, corsHeaders: Record<string, string>) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: CreateResourceRequest = await req.json();

    if (!body.title || !body.download_url) {
      return new Response(
        JSON.stringify({ error: 'Title and download_url are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validationResult = validateDownloadUrl(body.download_url);
    if (!validationResult.isValid) {
      return new Response(
        JSON.stringify({ error: validationResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accessibilityResult = await testUrlAccessibility(validationResult.sanitizedUrl!);
    if (!accessibilityResult.isAccessible) {
      return new Response(
        JSON.stringify({ error: accessibilityResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: resource, error: dbError } = await supabase
      .from('content')
      .insert({
        title: body.title,
        description: body.description,
        type: 'resource',
        category_id: body.category_id,
        download_url: validationResult.sanitizedUrl,
        status: 'published'
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, resource, message: 'Downloadable resource created successfully' }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create resource error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create resource',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleDownload(req: Request, supabase: any, corsHeaders: Record<string, string>) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required for downloads' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isRateLimited(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: DownloadRequest = await req.json();

    if (!body.resource_id) {
      return new Response(
        JSON.stringify({ error: 'resource_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: resource, error: resourceError } = await supabase
      .from('content')
      .select('*')
      .eq('id', body.resource_id)
      .eq('type', 'resource')
      .eq('status', 'published')
      .single();

    if (resourceError || !resource) {
      return new Response(
        JSON.stringify({ error: 'Resource not found or not accessible' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!resource.download_url) {
      return new Response(
        JSON.stringify({ error: 'Resource does not have a download URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await logDownloadAttempt(supabase, {
      resource_id: body.resource_id,
      user_id: user.id,
      download_url: resource.download_url,
      user_agent: req.headers.get('User-Agent') || 'Unknown',
      ip_address: req.headers.get('CF-Connecting-IP') ||
                  req.headers.get('X-Forwarded-For') ||
                  'Unknown'
    });

    return new Response(
      JSON.stringify({
        success: true,
        download_url: resource.download_url,
        filename: resource.title,
        resource_id: resource.id,
        message: 'Download authorized'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({
        error: 'Download failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleGetStats(req: Request, supabase: any, corsHeaders: Record<string, string>) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const resourceId = url.searchParams.get('resource_id');

    let query = supabase
      .from('download_logs')
      .select(`*, content:resource_id(title, type)`)
      .order('created_at', { ascending: false });

    if (resourceId) {
      query = query.eq('resource_id', resourceId);
    }

    const { data: logs, error } = await query.limit(100);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const stats = {
      total_downloads: logs.length,
      unique_users: new Set(logs.map((log: any) => log.user_id)).size,
      recent_downloads: logs.slice(0, 10),
      downloads_by_resource: logs.reduce((acc: Record<string, number>, log: any) => {
        const resourceTitle = log.content?.title || 'Unknown';
        acc[resourceTitle] = (acc[resourceTitle] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return new Response(
      JSON.stringify({ success: true, stats }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Stats error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

function validateDownloadUrl(url: string): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  try {
    const urlObj = new URL(url);

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    const domain = urlObj.hostname.toLowerCase();
    const isAllowedDomain = ALLOWED_DOMAINS.some(allowedDomain =>
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );

    if (!isAllowedDomain) {
      return { isValid: false, error: `Domain ${domain} is not in the allowed list` };
    }

    const pathname = urlObj.pathname.toLowerCase();
    const hasAllowedExtension = ALLOWED_EXTENSIONS.some(ext => pathname.endsWith(ext.toLowerCase()));

    if (!hasAllowedExtension && !pathname.includes('/download/') && !pathname.includes('/file/')) {
      return { isValid: false, error: 'File type not allowed or URL does not appear to be a download link' };
    }

    return { isValid: true, sanitizedUrl: urlObj.toString() };

  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

async function testUrlAccessibility(url: string): Promise<{ isAccessible: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    let response: Response;
    try {
      response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      return {
        isAccessible: false,
        error: `URL returned status ${response.status}: ${response.statusText}`
      };
    }

    return { isAccessible: true };

  } catch (error) {
    return {
      isAccessible: false,
      error: `URL is not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

async function logDownloadAttempt(supabase: any, logData: {
  resource_id: string;
  user_id: string;
  download_url: string;
  user_agent: string;
  ip_address: string;
}) {
  try {
    await supabase
      .from('download_logs')
      .insert({
        resource_id: logData.resource_id,
        user_id: logData.user_id,
        download_url: logData.download_url,
        user_agent: logData.user_agent,
        ip_address: logData.ip_address,
        success: true
      });
  } catch (error) {
    console.error('Failed to log download:', error);
  }
}
