/*
  # Create listings table

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `price` (numeric)
      - `property_type` (text)
      - `beds` (integer)
      - `baths` (integer)
      - `area` (numeric)
      - `amenities` (text[])
      - `photos` (text[])
      - `coordinates` (point)
      - `landlord_id` (uuid, references profiles)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `listings` table
    - Add policies for:
      - Public read access to active listings
      - Landlords can CRUD their own listings
*/

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  property_type text NOT NULL,
  beds integer,
  baths integer,
  area numeric,
  amenities text[],
  photos text[],
  coordinates point,
  landlord_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active listings"
  ON listings
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Landlords can create listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = landlord_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'landlord'
    )
  );

CREATE POLICY "Landlords can update own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = landlord_id)
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = landlord_id);

-- Create index for location search
CREATE INDEX IF NOT EXISTS listings_location_idx ON listings USING GIN (to_tsvector('english', location));

-- Create index for property type
CREATE INDEX IF NOT EXISTS listings_property_type_idx ON listings (property_type);

-- Create index for price range searches
CREATE INDEX IF NOT EXISTS listings_price_idx ON listings (price);