// Repository Pattern (Fowler) - the only file that talks to Supabase directly
// Encrypts/decrypts tokens here so the rest of the app only ever sees plain text

const { createClient } = require('@supabase/supabase-js');
const { encrypt, decrypt } = require('./encryption.js');

class DatabaseRepository {
  constructor() {
    this._client = null;
  }

  _getClient() {
    if (this._client) return this._client;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('[DatabaseRepository] Missing SUPABASE_URL or Supabase key in environment');
    }
    this._client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    return this._client;
  }

  // users
  async findOrCreateUserByEmail(email) {
    const supabase = this._getClient();
    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (selectError)
      throw new Error(
        `[DatabaseRepository] findOrCreateUserByEmail select failed: ${selectError.message}`
      );
    if (existing) return existing;
    const { data: created, error: insertError } = await supabase
      .from('users')
      .insert({ email })
      .select()
      .single();
    if (insertError)
      throw new Error(
        `[DatabaseRepository] findOrCreateUserByEmail insert failed: ${insertError.message}`
      );
    return created;
  }

  // notion_connections
  async saveNotionConnection(userId, connection) {
    const supabase = this._getClient();
    const encryptedAccessToken = encrypt(connection.accessToken);
    const { data, error } = await supabase
      .from('notion_connections')
      .upsert(
        {
          user_id: userId,
          encrypted_access_token: encryptedAccessToken,
          workspace_id: connection.workspaceId,
          workspace_name: connection.workspaceName || null,
          bot_id: connection.botId || null,
          token_expires_at: connection.tokenExpiresAt || null
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();
    if (error)
      throw new Error(`[DatabaseRepository] saveNotionConnection failed: ${error.message}`);
    return data;
  }

  async findNotionConnection(userId) {
    const supabase = this._getClient();
    const { data, error } = await supabase
      .from('notion_connections')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error)
      throw new Error(`[DatabaseRepository] findNotionConnection failed: ${error.message}`);
    if (!data) return null;
    return {
      accessToken: decrypt(data.encrypted_access_token),
      workspaceId: data.workspace_id,
      workspaceName: data.workspace_name,
      botId: data.bot_id,
      tokenExpiresAt: data.token_expires_at
    };
  }

  // notion_database_refs
  async saveNotionDatabaseRefs(userId, refs) {
    const supabase = this._getClient();
    const { data, error } = await supabase
      .from('notion_database_refs')
      .upsert(
        {
          user_id: userId,
          goal_data_source_id: refs.goalDbId,
          milestone_data_source_id: refs.milestoneDbId,
          task_data_source_id: refs.taskDbId,
          subtask_data_source_id: refs.subtaskDbId
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();
    if (error)
      throw new Error(`[DatabaseRepository] saveNotionDatabaseRefs failed: ${error.message}`);
    return data;
  }

  async findNotionDatabaseRefs(userId) {
    const supabase = this._getClient();
    const { data, error } = await supabase
      .from('notion_database_refs')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error)
      throw new Error(`[DatabaseRepository] findNotionDatabaseRefs failed: ${error.message}`);
    return data;
  }

  // conversation_sessions - stands in for memory, since functions don't persist state between calls
  async findConversationSession(sessionId) {
    const supabase = this._getClient();
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();
    if (error)
      throw new Error(`[DatabaseRepository] findConversationSession failed: ${error.message}`);
    return data;
  }

  async createConversationSession(userId, sessionId) {
    const supabase = this._getClient();
    const { data, error } = await supabase
      .from('conversation_sessions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        conversation_history: []
      })
      .select()
      .single();
    if (error)
      throw new Error(`[DatabaseRepository] createConversationSession failed: ${error.message}`);
    return data;
  }

  async updateConversationHistory(sessionId, conversationHistory) {
    const supabase = this._getClient();
    const { data, error } = await supabase
      .from('conversation_sessions')
      .update({ conversation_history: conversationHistory, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId)
      .select()
      .single();
    if (error)
      throw new Error(`[DatabaseRepository] updateConversationHistory failed: ${error.message}`);
    return data;
  }
}

// Encapsulate Conditional (Fowler) - one named check instead of repeating this in two files
function hasAllDatabaseRefs(refs) {
  return Boolean(
    refs &&
      refs.goal_data_source_id &&
      refs.milestone_data_source_id &&
      refs.task_data_source_id &&
      refs.subtask_data_source_id
  );
}

module.exports = { DatabaseRepository, hasAllDatabaseRefs };
