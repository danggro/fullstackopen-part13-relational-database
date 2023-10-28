CREATE TABLE blogs (
    id SERIAL PRIMARY KEY, 
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
    );

INSERT INTO blogs 
    (author, url, title)
    VALUES ('Danggro', 'www.google.com', 'Bloody Moon' );

INSERT INTO blogs 
    (author, url, title)
    VALUES ('Digran', 'www.google.com', 'Heavy Rain' );