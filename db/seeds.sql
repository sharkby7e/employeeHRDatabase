INSERT INTO departments (dept_name)
VALUES
  ("vocals"),
  ("percussion"),
  ("strings"),
  ("woodwinds");
  

INSERT INTO roles (title, salary, department_id ) 
  VALUES 
    ("soprano", 200, 1),
    ("alto", 300, 1),
    ("tenor", 250, 1),
    ("bass", 200, 1),
    ("vocal section leader", 1000, 1),
    ("timpani", 100, 2),
    ("snare", 200, 2),
    ("bass", 300, 2),
    ("triangle", 800, 2),
    ("percussion section leader", 1000, 2),
    ("violin", 500, 3),
    ("viola", 500, 3),
    ("cello", 600, 3),
    ("bass", 400, 3),
    ("string section leader", 1000, 3),
    ("flute", 600, 4),
    ("clarinet", 450, 4),
    ("oboe", 550, 4),
    ("bassoon", 750, 4),
    ("woodwind section leader", 1000, 4);
   

INSERT INTO employees ( first_name, last_name, role_id, manager_id) 
  VALUES 
    ("Kaia", "Higha", 1, 9),
    ("Lisa", "Screecha", 1, 9),
    ("Judy", "Hooty", 2, 9),
    ("Parker", "Barker", 2, 9),
    ("False", "Etto", 3, 9),
    ("Cas", "Trato", 3, 9),
    ("Count", "Bassy", 4, 9),
    ("Prof", "Oondi", 4, 9),
    ("Magen", "Solomon", 5, NULL),

    ("Osman", "Felicitas", 6, 18),
    ("Birkir", "Koloman", 6, 18),
    ("Minakshi", "Stefka", 7, 18),
    ("Otilia", "Grace", 7, 18),
    ("Liisi", "Arnd", 8, 18),
    ("Beatris", "Patxi", 8, 18),
    ("Chrysanta", "Mahfuz", 9, 18),
    ("Dalia", "Jirou", 9, 18),
    ("Devon", "Miles", 10, NULL),

    ("Dubthach", "Theophanes", 11, 27),
    ("Pippin", "Mostafa", 11, 27),
    ("Adrian", "Evzen", 12, 27),
    ("Marceau", "Galla", 12, 27),
    ("Luciano", "Eloise", 13, 27),
    ("Gertrudes", "Antje", 13, 27),
    ("Irena", "Glauco", 14, 27),
    ("Sandi", "Enis", 14, 27),
    ("Niccolo", "Paganini", 15, NULL),

    ("Jusuf", "Okeke", 16, 36),
    ("Rana", "Anthelm", 16, 36),
    ("Taron", "Marijana", 17, 36),
    ("Urbano", "Emelrich", 17, 36),
    ("Maren", "Inesa", 18, 36),
    ("Sigurd", "Brigada", 18, 36),
    ("Nathalie", "Lorenza", 19, 36),
    ("Leubald", "Okafor", 19, 36),
    ("Squidward", "Tentacles", 20, NULL);






