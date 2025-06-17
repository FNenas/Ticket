-- database.sql (MySQL Version)

-- Drop tables if they exist (optional, for easier re-running during development)
DROP TABLE IF EXISTS TicketComments;
DROP TABLE IF EXISTS Attachments;
DROP TABLE IF EXISTS Tickets;
DROP TABLE IF EXISTS Users;

-- Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'SUPPORT', 'CLIENT')),
    phone_number VARCHAR(50) NULL UNIQUE,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB;

-- Tickets Table
CREATE TABLE Tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Process', 'Closed', 'Resolved')),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    client_user_id INT NOT NULL,
    assigned_to_user_id INT NULL,
    whatsapp_message_id VARCHAR(255) NULL UNIQUE,
    FOREIGN KEY (client_user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_user_id) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- TicketComments Table
CREATE TABLE TicketComments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    is_internal_note BOOLEAN DEFAULT FALSE, -- MySQL converts BOOLEAN to TINYINT(1)
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Attachments Table
CREATE TABLE Attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL, -- User who uploaded
    file_path VARCHAR(512) NOT NULL, -- Path to the stored file
    original_file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT, -- Size in bytes
    uploaded_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
