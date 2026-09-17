# 21st.dev MCP setup (Cursor)

## Status in this chat
Your `.cursor/mcp.json` already has the 21st server + API key.  
**This Agent session still cannot see 21st tools** until Cursor loads that MCP into a fresh chat.

## What you do (required to use 21st here)
1. Cursor → **Settings → MCP**
2. Find **21st** → toggle off/on or click Refresh
3. Confirm it shows Connected / green
4. **Start a new Agent chat** in this project (old chats keep the old tool list)
5. Say “use 21st MCP” and ask for a component

Optional CLI (repo root):
```bash
npx @21st-dev/cli@latest init --client cursor --write
```

Key page: https://21st.dev/settings/api-keys  
Docs: https://help.21st.dev/ai/mcp

Do not commit API keys if the repo is public.
