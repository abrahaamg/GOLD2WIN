-- insert secciones
INSERT INTO SECCION (ID, ENABLED, GRUPO, NOMBRE) VALUES
(1, true, 'Deportes en Equipo', 'Futbol'),
(2, true, 'Deportes en Equipo', 'baloncesto'),
(3, true, 'Deportes en Equipo', 'Beisbol'),
(4, true, 'Deportes en Equipo', 'balonmano'),
(5, true, 'Deportes individuales', 'Esgrima'),
(6, true, 'Deportes individuales', 'Tenis'),
(7, true, 'Deportes individuales', 'ping pong'),
(9, true, 'Deportes individuales', 'Golf'),
(10, true, 'eSports', 'League of Legends'),
(11, true, 'eSports', 'Counter Strike'),
(12, true, 'eSports', 'Valorant'),
(13, true, 'eSports', 'Overwatch'),
(14, true, 'eSports', 'Rocket League');

-- insert eventos
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(1, false, false, '2025-06-10 18:00:00', '2025-03-01 12:00:00', 'Final Liga Española', 1),
(2, false, false, '2025-06-22 20:30:00', '2025-03-02 14:15:00', 'NBA Playoffs - Lakers vs Celtics', 2),
(3, false, false, '2025-06-10 16:00:00', '2025-03-03 10:30:00', 'Serie Mundial de Beisbol', 3),
(4, false, false, '2025-05-20 19:00:00', '2025-03-05 09:45:00', 'Copa Europa de Balonmano', 4),
(5, false, false, '2025-1-02 15:00:00', '2025-03-06 08:00:00', 'Campeonato Mundial de Esgrima', 5),
(6, false, false, '2025-06-22 21:00:00', '2025-03-07 13:20:00', 'Roland Garros - Final Masculina', 6),
(7, false, false, '2025-06-23 11:00:00', '2025-03-08 07:30:00', 'Torneo Internacional de Ping Pong', 7),
(9, false, false, '2025-05-20 13:00:00', '2025-03-10 11:15:00', 'Masters de Golf en Augusta', 9),
(10, false, false, '2025-05-20 17:30:00', '2025-03-11 15:45:00', 'Worlds - League of Legends', 10),
(11, false, false, '2025-06-08 19:00:00', '2025-03-12 10:50:00', 'Major de Counter Strike', 11),
(12, false, false, '2025-06-08 20:00:00', '2025-03-13 14:25:00', 'Final de Valorant Champions', 12),
(13, false, false, '2025-03-11 10:30:00', '2024-06-08 20:00:00', 'LEC: MDK vs FNC', 12);

-- inserta etiquetas
INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(1, 'futbol'), (1, 'liga'), (1, 'España'), (1, 'final'), (1, 'deportes'),
(2, 'baloncesto'), (2, 'NBA'), (2, 'playoffs'), (2, 'Lakers'), (2, 'Celtics'), (2, 'USA'),
(3, 'beisbol'), (3, 'Serie Mundial'), (3, 'final'), (3, 'MLB'), (3, 'deportes'),
(4, 'balonmano'), (4, 'Copa Europa'), (4, 'clubes'), (4, 'Europa'), (4, 'final'),
(5, 'esgrima'), (5, 'Mundial'), (5, 'campeonato'), (5, 'individual'), (5, 'deporte'),
(6, 'tenis'), (6, 'Roland Garros'), (6, 'Grand Slam'), (6, 'final'), (6, 'Francia'),
(7, 'ping pong'), (7, 'torneo'), (7, 'internacional'), (7, 'rápido'), (7, 'Asia'),
(9, 'golf'), (9, 'Masters'), (9, 'Augusta'), (9, 'USA'), (9, 'profesional'),
(10, 'eSports'), (10, 'League of Legends'), (10, 'Worlds'), (10, 'final'), (10, 'MOBA'),
(11, 'eSports'), (11, 'Counter Strike'), (11, 'Major'), (11, 'FPS'), (11, 'torneo'),
(12, 'eSports'), (12, 'Valorant'), (12, 'Champions'), (12, 'final'), (12, 'shooter');

-- insert admin (username a, password aa)
INSERT INTO IWUser (ID, DINERO_DISPONIBLE, DINERO_RETENIDO, EMAIL, ENABLED, FIRST_NAME, LAST_NAME, PASSWORD, ROLES, USERNAME) VALUES
(1, 0.0, 0.0, 'julianix882@gmail.com', TRUE, 'julián', 'Reguera Peñalosa', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'julianix'),
(2, 100.0, 20.0, 'maria.garcia@example.com', TRUE, 'María', 'García López', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'mgarcia'),
(3, 200.0, 50.0, 'carlos.hernandez@example.com', TRUE, 'Carlos', 'Hernández Ruiz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'chernandez'),
(4, 50.0, 0.0, 'ana.martinez@example.com', TRUE, 'Ana', 'Martínez Sánchez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'amartinez'),
(5, 300.0, 30.0, 'luis.flores@example.com', TRUE, 'Luis', 'Flores Mendoza', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN', 'lflores'),
(6, 0.0, 0.0, 'sofia.rodriguez@example.com', TRUE, 'Sofía', 'Rodríguez Gómez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'srodriguez'),
(7, 120.0, 10.0, 'andres.lopez@example.com', TRUE, 'Andrés', 'López Martínez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'alopez'),
(8, 80.0, 5.0, 'carla.gomez@example.com', TRUE, 'Carla', 'Gómez García', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'cgomez'),
(9, 500.0, 100.0, 'diego.sanchez@example.com', TRUE, 'Diego', 'Sánchez Pérez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'dsanchez'),
(10, 60.0, 0.0, 'lucia.ramirez@example.com', TRUE, 'Lucía', 'Ramírez Torres', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'lramirez'),
(11, 130.55, 22.00, 'ramon@gmail.com', TRUE, 'Ramon', 'apellido1 apellido2', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'Ramon'),
(12, 130.55, 22.00, 'Jose_Luis@gmail.com', TRUE, 'Jose Luis', 'apellido1 apellido2', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'Jose Luis'),
(13, 400.0, 15.0, 'elena.fernandez@example.com', TRUE, 'Elena', 'Fernández Díaz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'efernandez'),
(14, 580.0, 40.0, 'pedro.alvarez@example.com', TRUE, 'Pedro', 'Álvarez Ruiz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'palvarez'),
(15, 250.0, 0.0, 'isabel.perez@example.com', TRUE, 'Isabel', 'Pérez López', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN', 'iperez');

-- INSERT FORMULA_APUESTA con FECHA_CREACION
INSERT INTO FORMULA_APUESTA 
    (ID, DINERO_AFAVOR, DINERO_EN_CONTRA, FORMULA, NOMBRE, RESULTADO, CREADOR_ID, EVENTO_ID, FECHA_CREACION)
VALUES
(1, 0, 0, 'goles Barsa > goles Madrid', 'Gana Barsa', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
(2, 0, 0, 'puntos Lakers > puntos Celtics', 'Victoria Lakers', 'INDETERMINADO', 2, 2, '2025-03-22 14:53:00'),
(3, 20, 55, 'carreras Yankees > carreras Dodgers', 'Ganan Yankees', 'INDETERMINADO', 3, 3, '2025-03-22 14:53:00'),
(4, 0, 0, 'goles Kiel > goles Veszprem', 'Gana Kiel', 'INDETERMINADO', 4, 4, '2025-03-22 14:53:00'),
(5, 100, 30, 'toquesDobles > 3', 'Total toquesDobles', 'INDETERMINADO', 5, 5, '2025-03-22 14:53:00'),
(6, 0, 0, 'sets Nadal > sets Djokovic', 'Gana Nadal', 'INDETERMINADO', 6, 6, '2025-03-22 14:53:00'),
(7, 0, 0, 'puntos Wang > puntos Lee', 'Gana Wang', 'INDETERMINADO', 7, 7, '2025-03-22 14:53:00'),
(9, 0, 0, 'golpes Woods > golpes McIlroy', 'Gana Woods', 'INDETERMINADO', 9, 9, '2025-03-22 14:53:00'),
(10, 0, 0, 'torres destruidas G2 > torres destruidas T1', 'Gana G2', 'INDETERMINADO', 10, 10, '2025-03-22 14:53:00'),
(11, 0, 0, 'rounds ganados NaVi > rounds ganados Vitality', 'Victoria NaVi', 'ERROR', 11, 11, '2025-03-22 14:53:00'),
(12, 50, 750, 'mapas ganados Fnatic > mapas ganados Sentinels', 'Gana Fnatic', 'GANADO', 12, 12, '2025-03-22 14:53:00'),
(13, 0, 0, 'hoyos Woods > hoyos McIlroy', 'Gana Woods', 'INDETERMINADO', 9, 9, '2025-03-22 14:53:00'),
(14, 0, 0, 'promedio birdies Woods < promedio birdies McIlroy', 'Gana McIlroy', 'INDETERMINADO', 9, 9, '2025-03-22 14:53:00');


-- INSERT de 25 fórmulas de apuesta adicionales para el evento con ID 1
INSERT INTO FORMULA_APUESTA 
    (ID, DINERO_AFAVOR, DINERO_EN_CONTRA, FORMULA, NOMBRE, RESULTADO, CREADOR_ID, EVENTO_ID, FECHA_CREACION)
VALUES
    (15, 0, 0, 'goles EquipoA > goles EquipoB - 15', 'Apuesta 15', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (16, 0, 0, 'goles EquipoA > goles EquipoB - 16', 'Apuesta 16', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (17, 0, 0, 'goles EquipoA > goles EquipoB - 17', 'Apuesta 17', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (18, 0, 0, 'goles EquipoA > goles EquipoB - 18', 'Apuesta 18', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (19, 0, 0, 'goles EquipoA > goles EquipoB - 19', 'Apuesta 19', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (20, 0, 0, 'goles EquipoA > goles EquipoB - 20', 'Apuesta 20', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (21, 0, 0, 'goles EquipoA > goles EquipoB - 21', 'Apuesta 21', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (22, 0, 0, 'goles EquipoA > goles EquipoB - 22', 'Apuesta 22', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (23, 0, 0, 'goles EquipoA > goles EquipoB - 23', 'Apuesta 23', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (24, 0, 0, 'goles EquipoA > goles EquipoB - 24', 'Apuesta 24', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (25, 0, 0, 'goles EquipoA > goles EquipoB - 25', 'Apuesta 25', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (26, 0, 0, 'goles EquipoA > goles EquipoB - 26', 'Apuesta 26', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (27, 0, 0, 'goles EquipoA > goles EquipoB - 27', 'Apuesta 27', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (28, 0, 0, 'goles EquipoA > goles EquipoB - 28', 'Apuesta 28', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (29, 0, 0, 'goles EquipoA > goles EquipoB - 29', 'Apuesta 29', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (30, 0, 0, 'goles EquipoA > goles EquipoB - 30', 'Apuesta 30', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (31, 0, 0, 'goles EquipoA > goles EquipoB - 31', 'Apuesta 31', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (32, 0, 0, 'goles EquipoA > goles EquipoB - 32', 'Apuesta 32', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (33, 0, 0, 'goles EquipoA > goles EquipoB - 33', 'Apuesta 33', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (34, 0, 0, 'goles EquipoA > goles EquipoB - 34', 'Apuesta 34', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (35, 0, 0, 'goles EquipoA > goles EquipoB - 35', 'Apuesta 35', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (36, 0, 0, 'goles EquipoA > goles EquipoB - 36', 'Apuesta 36', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (37, 0, 0, 'goles EquipoA > goles EquipoB - 37', 'Apuesta 37', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (38, 0, 0, 'goles EquipoA > goles EquipoB - 38', 'Apuesta 38', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
    (39, 0, 0, 'goles EquipoA > goles EquipoB - 39', 'Apuesta 39', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00');

-- INSERT APUESTA
INSERT INTO APUESTA (ID, CANTIDAD, A_FAVOR, APOSTADOR_ID, FORMULA) VALUES
(1, 50.0, TRUE, 1, 1),
(2, 30.0, FALSE, 2, 2),
(3, 75.5, TRUE, 3, 3),
(4, 20.0, FALSE, 4, 4),
(5, 100.0, TRUE, 11, 5),
(6, 45.0, TRUE, 6, 6),
(7, 60.0, FALSE, 7, 7),
(9, 90.0, FALSE, 9, 9),
(10, 15.0, TRUE, 10, 10),
(11, 120.0, FALSE, 11, 11),
(12, 35.0, TRUE, 12, 12),
(13, 400.0, FALSE, 12, 12),
(14, 350.0, FALSE, 12, 12),
(15, 15.0, TRUE, 12, 12),
(16, 30.0, FALSE, 11, 5);

-- INSERT VARIABLESECCION
INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(1, 'goles', TRUE, NULL, 1),
(2, 'puntos', TRUE, NULL, 2),
(3, 'carreras', TRUE, NULL, 3),
(4, 'goles', TRUE, NULL, 4),
(5, 'toques', TRUE, NULL, 5),
(6, 'sets', TRUE, NULL, 6),
(7, 'puntos', TRUE, NULL, 7),
(9, 'golpes', TRUE, NULL, 9),
(13, 'hoyos', TRUE, NULL, 9),
(14, 'promedio birdies', TRUE, NULL, 9),
(10, 'torres destruidas', TRUE, NULL, 10),
(11, 'rounds ganados', TRUE, NULL, 11),
(12, 'mapas ganados', TRUE, NULL, 12);

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(15, 'numToquesEspaña', TRUE, NULL, 5),
(16, 'numToquesRusia', TRUE, NULL, 5),
(17, 'duracionCombateSegundos', TRUE, NULL, 5),
(18, 'toquesDobles', TRUE, NULL, 5),
(19, 'tarjetasAmarillasEspaña', TRUE, NULL, 5),
(20, 'tarjetasAmarillasRusia', TRUE, NULL, 5),
(21, 'tarjetasRojasEspaña', TRUE, NULL, 5),
(22, 'tarjetasRojasRusia', TRUE, NULL, 5),
(23, 'paradasEspaña', TRUE, NULL, 5),
(24, 'paradasRusia', TRUE, NULL, 5);



-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;
