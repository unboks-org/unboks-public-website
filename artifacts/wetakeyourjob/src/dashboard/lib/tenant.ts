// Tenant / product identity constants.
// Multi-tenant architecture: every Unboks client uses the same codebase.
// These are the defaults for the Unboks.org demo / fallback client.
// Per-client overrides will come from the API (api.getConfig) once
// the backend exposes a tenant metadata endpoint.
//
// Usage:  import { PRODUCT_NAME, AGENT_NAME } from '@dashboard/lib/tenant';
//
// DO NOT hardcode client-specific names (e.g. "Blue Marlin Tours") anywhere
// in the dashboard shell — always reference these constants.

export const PRODUCT_NAME = "Unboks";
export const CLIENT_NAME  = "Unboks.org";
export const AGENT_NAME   = "AI Assistant";
