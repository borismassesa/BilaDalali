/*
  # Create messages table

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `tenant_id` (uuid, references profiles)
      - `landlord_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, references conversations)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Users can read conversations they're part of
      - Users can read/write messages in their conversations
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, tenant_id, landlord_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversation policies
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = tenant_id OR
    auth.uid() = landlord_id
  );

-- Message policies
CREATE POLICY "Users can read messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND (tenant_id = auth.uid() OR landlord_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (tenant_id = auth.uid() OR landlord_id = auth.uid())
    )
    AND sender_id = auth.uid()
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS conversations_tenant_id_idx ON conversations (tenant_id);
CREATE INDEX IF NOT EXISTS conversations_landlord_id_idx ON conversations (landlord_id);
CREATE INDEX IF NOT EXISTS conversations_listing_id_idx ON conversations (listing_id);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages (sender_id);