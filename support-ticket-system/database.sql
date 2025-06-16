-- Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'SUPPORT', 'CLIENT')),
    phone_number VARCHAR(50) NULL UNIQUE, -- To be used for WhatsApp integration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tickets Table
CREATE TABLE Tickets (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Process', 'Closed', 'Resolved')), -- Added 'Resolved' as a common status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    client_user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    assigned_to_user_id INTEGER NULL REFERENCES Users(id) ON DELETE SET NULL, -- A ticket might be unassigned
    whatsapp_message_id VARCHAR(255) NULL UNIQUE -- To store unique ID from WhatsApp message if ticket originated from there
);

-- TicketComments Table
CREATE TABLE TicketComments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES Tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE, -- User who made the comment
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_internal_note BOOLEAN DEFAULT FALSE -- For support/admin internal notes not visible to client
);

-- Attachments Table
CREATE TABLE Attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES Tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE, -- User who uploaded
    file_path VARCHAR(512) NOT NULL, -- Path to the stored file
    original_file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER, -- Size in bytes
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to Users table
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Apply trigger to Tickets table
CREATE TRIGGER set_timestamp_tickets
BEFORE UPDATE ON Tickets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
