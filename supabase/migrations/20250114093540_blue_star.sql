/*
  # Create storage bucket for clothing images

  1. New Storage Bucket
    - Creates a new public bucket named 'clothing-images' for storing clothing item photos
  2. Security
    - Enables public access for reading images
    - Restricts uploads to authenticated users only
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-images', 'clothing-images', true);

-- Create policy to allow public access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'clothing-images');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'clothing-images' AND
  auth.uid() = owner
);