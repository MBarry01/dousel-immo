-- Add contact_phone column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS contact_phone text;

-- Add comment for clarity
COMMENT ON COLUMN properties.contact_phone IS 'Specific contact phone number for this property listing. Overrides owner profile phone if present.';
