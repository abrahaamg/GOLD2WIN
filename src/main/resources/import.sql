-- insert secciones
INSERT INTO SECCION (ID, ENABLED, GRUPO, NOMBRE) VALUES
(1, true, 'Deportes en Equipo', 'Futbol'),
(2, true, 'Deportes en Equipo', 'Baloncesto'),
(3, true, 'Deportes en Equipo', 'Beisbol'),
(4, true, 'Deportes en Equipo', 'Balonmano'),
(5, true, 'Deportes individuales', 'Esgrima'),
(6, true, 'Deportes individuales', 'Tenis'),
(7, true, 'Deportes individuales', 'Ping pong'),
(8, true, 'Deportes individuales', 'Boxeo'),
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
(8, false, false, '2025-05-20 13:00:00', '2025-05-10 15:15:00', 'Exhibición de mayo', 8),
(9, false, false, '2025-05-20 13:00:00', '2025-03-10 11:15:00', 'Masters de Golf en Augusta', 9),
(10, false, false, '2025-05-20 17:30:00', '2025-03-11 15:45:00', 'Worlds - League of Legends', 10),
(11, false, false, '2025-06-08 19:00:00', '2025-03-12 10:50:00', 'Major de Counter Strike', 11),
(12, false, false, '2025-06-08 20:00:00', '2025-03-13 14:25:00', 'Final de Valorant Champions', 12),
(13, false, false, '2025-03-11 10:30:00', '2024-06-08 20:00:00', 'LEC: MDK vs FNC', 12);

-- inserta etiquetas
INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(1, 'Futbol'), (1, 'Liga'), (1, 'España'), (1, 'Final'), (1, 'Deportes'),
(2, 'Baloncesto'), (2, 'NBA'), (2, 'Playoffs'), (2, 'Lakers'), (2, 'Celtics'), (2, 'USA'),
(3, 'Beisbol'), (3, 'Serie Mundial'), (3, 'Final'), (3, 'MLB'), (3, 'Deportes'),
(4, 'Balonmano'), (4, 'Copa Europa'), (4, 'Clubes'), (4, 'Europa'), (4, 'Final'),
(5, 'Esgrima'), (5, 'Mundial'), (5, 'campeonato'), (5, 'individual'), (5, 'deporte'),
(6, 'Tenis'), (6, 'Roland Garros'), (6, 'Grand Slam'), (6, 'Final'), (6, 'Francia'),
(7, 'Ping pong'), (7, 'Torneo'), (7, 'Internacional'), (7, 'Rápido'), (7, 'Asia'),
(8, 'Boxeo'), (8, 'Exhibición'), (8, 'Deporte de contacto'), 
(9, 'Golf'), (9, 'Masters'), (9, 'Augusta'), (9, 'USA'), (9, 'Profesional'),
(10, 'eSports'), (10, 'League of Legends'), (10, 'Worlds'), (10, 'Final'), (10, 'MOBA'),
(11, 'eSports'), (11, 'Counter Strike'), (11, 'Major'), (11, 'FPS'), (11, 'Torneo'),
(12, 'eSports'), (12, 'Valorant'), (12, 'Champions'), (12, 'Final'), (12, 'Shooter');

-- insert admin (username a, password aa)
INSERT INTO IWUser (ID, DINERO_DISPONIBLE, DINERO_RETENIDO, EMAIL, ENABLED, FIRST_NAME, LAST_NAME, PASSWORD, ROLES, USERNAME) VALUES
(1, 00, 00, 'julianix882@gmail.com', TRUE, 'julián', 'Reguera Peñalosa', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'julianix'),
(2, 10000, 2000, 'maria.garcia@example.com', TRUE, 'María', 'García López', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'mgarcia'),
(3, 20000, 5000, 'carlos.hernandez@example.com', TRUE, 'Carlos', 'Hernández Ruiz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'chernandez'),
(4, 5000, 00, 'ana.martinez@example.com', TRUE, 'Ana', 'Martínez Sánchez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'amartinez'),
(5, 30000, 3000, 'luis.flores@example.com', TRUE, 'Luis', 'Flores Mendoza', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN', 'lflores'),
(6, 00, 00, 'sofia.rodriguez@example.com', TRUE, 'Sofía', 'Rodríguez Gómez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'srodriguez'),
(7, 12000, 1000, 'andres.lopez@example.com', TRUE, 'Andrés', 'López Martínez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'alopez'),
(8, 8000, 500, 'carla.gomez@example.com', TRUE, 'Carla', 'Gómez García', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'cgomez'),
(9, 50000, 10000, 'diego.sanchez@example.com', TRUE, 'Diego', 'Sánchez Pérez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'dsanchez'),
(10, 6000, 00, 'lucia.ramirez@example.com', TRUE, 'Lucía', 'Ramírez Torres', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'lramirez'),
(11, 13055, 2200, 'ramon@gmail.com', TRUE, 'Ramon', 'apellido1 apellido2', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'Ramon'),
(12, 13055, 2200, 'Jose_Luis@gmail.com', TRUE, 'Jose Luis', 'apellido1 apellido2', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'Jose Luis'),
(13, 40000, 1500, 'elena.fernandez@example.com', TRUE, 'Elena', 'Fernández Díaz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'efernandez'),
(14, 58000, 4000, 'pedro.alvarez@example.com', TRUE, 'Pedro', 'Álvarez Ruiz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'palvarez'),
(15, 25000, 00, 'isabel.perez@example.com', TRUE, 'Isabel', 'Pérez López', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN', 'iperez');

-- INSERT FORMULA_APUESTA con FECHA_CREACION
INSERT INTO FORMULA_APUESTA 
    (ID, DINERO_AFAVOR, DINERO_EN_CONTRA, FORMULA, NOMBRE, RESULTADO, CREADOR_ID, EVENTO_ID, FECHA_CREACION)
VALUES
(1, 0, 0, 'Goles Barsa > Goles Madrid', 'Gana Barsa', 'INDETERMINADO', 1, 1, '2025-03-22 14:53:00'),
(2, 0, 0, 'Puntos Lakers > Puntos Celtics', 'Victoria Lakers', 'INDETERMINADO', 2, 2, '2025-03-22 14:53:00'),
(3, 20, 55, 'Carreras Yankees > carreras Dodgers', 'Ganan Yankees', 'INDETERMINADO', 3, 3, '2025-03-22 14:53:00'),
(4, 0, 0, 'Goles Kiel > Goles Veszprem', 'Gana Kiel', 'INDETERMINADO', 4, 4, '2025-03-22 14:53:00'),
(5, 100, 30, 'ToquesDobles > 3', 'Total toquesDobles', 'INDETERMINADO', 5, 5, '2025-03-22 14:53:00'),
(6, 0, 0, 'Sets Nadal > Sets Djokovic', 'Gana Nadal', 'INDETERMINADO', 6, 6, '2025-03-22 14:53:00'),
(7, 0, 0, 'Puntos Wang > Puntos Lee', 'Gana Wang', 'INDETERMINADO', 7, 7, '2025-03-22 14:53:00'),
(8, 0, 0, 'Número de asaltos > 3', 'Total asaltos', 'INDETERMINADO', 7, 7, '2025-03-13 22:31:00'),
(9, 0, 0, 'Golpes Woods > Golpes McIlroy', 'Gana Woods', 'INDETERMINADO', 9, 9, '2025-03-22 14:53:00'),
(10, 0, 0, 'Torres destruidas G2 > Torres destruidas T1', 'Gana G2', 'INDETERMINADO', 10, 10, '2025-03-22 14:53:00'),
(11, 0, 0, 'Rounds ganados NaVi > Rounds ganados Vitality', 'Victoria NaVi', 'INDETERMINADO', 11, 11, '2025-03-22 14:53:00'),
(12, 50, 750, 'Mapas ganados Fnatic > Mapas ganados Sentinels', 'Gana Fnatic', 'PERDIDO', 12, 12, '2025-03-22 14:53:00'),
(13, 0, 0, 'Hoyos Woods > Hoyos McIlroy', 'Gana Woods', 'INDETERMINADO', 9, 9, '2025-03-22 14:53:00'),
(14, 0, 0, 'Promedio birdies Woods < PSromedio birdies McIlroy', 'Gana McIlroy', 'INDETERMINADO', 9, 9, '2025-03-22 14:53:00');


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
(1, 5000, TRUE, 1, 1),
(2, 3000, FALSE, 2, 2),
(3, 7505, TRUE, 3, 3),
(4, 2000, FALSE, 4, 4),
(5, 10000, TRUE, 11, 5),
(6, 4500, TRUE, 6, 6),
(7, 6000, FALSE, 7, 7),
(9, 9000, FALSE, 9, 9),
(10, 1500, TRUE, 10, 10),
(11, 12000, FALSE, 11, 11),
(12, 3500, TRUE, 12, 12),
(13, 40000, FALSE, 12, 12),
(14, 35000, FALSE, 12, 12),
(15, 1500, TRUE, 12, 12),
(16, 3000, FALSE, 11, 5);

-- INSERT VARIABLESECCION
INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(1, 'Goles', TRUE, NULL, 1),
(2, 'Puntos', TRUE, NULL, 2),
(3, 'Carreras', TRUE, NULL, 3),
(4, 'Goles', TRUE, NULL, 4),
(5, 'Toques', TRUE, NULL, 5),
(6, 'Sets', TRUE, NULL, 6),
(7, 'Puntos', TRUE, NULL, 7),
(9, 'Golpes', TRUE, NULL, 9),
(13, 'Hoyos', TRUE, NULL, 9),
(14, 'Promedio birdies', TRUE, NULL, 9),
(10, 'Torres destruidas', TRUE, NULL, 10),
(11, 'Rounds ganados', TRUE, NULL, 11),
(12, 'mapas ganados', TRUE, NULL, 12);

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(15, 'NumToquesEspaña', TRUE, NULL, 5),
(16, 'NumToquesRusia', TRUE, NULL, 5),
(17, 'DuracionCombateSegundos', TRUE, NULL, 5),
(18, 'ToquesDobles', TRUE, NULL, 5),
(19, 'TarjetasAmarillasEspaña', TRUE, NULL, 5),
(20, 'TarjetasAmarillasRusia', TRUE, NULL, 5),
(21, 'TarjetasRojasEspaña', TRUE, NULL, 5),
(22, 'TarjetasRojasRusia', TRUE, NULL, 5),
(23, 'ParadasEspaña', TRUE, NULL, 5),
(24, 'ParadasRusia', TRUE, NULL, 5);

INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(1, 'Goles', TRUE, 1),
(2, 'Goles-EquiA', TRUE, 1),
(3, 'Goles-EquiB', TRUE, 1),
(4, 'Amarillas', TRUE, 1),
(5, 'Corners', TRUE, 1),
(6, 'Rojas', TRUE, 1),
(7, 'Puntos', TRUE, 2),
(8, 'Puntos-EquiA', TRUE, 2),
(9, 'Puntos-EquiB', TRUE, 2),
(10, 'Triples', TRUE, 2),
(11, 'Carreras', TRUE, 3),
(12, 'Carreras-EquiA', TRUE, 3),
(13, 'Carreras-EquiB', TRUE, 3),
(14, 'Home-runs', TRUE, 3),
(15, 'Goles', TRUE, 4),
(16, 'Goles-EquiA', TRUE, 4),
(17, 'Goles-EquiB', TRUE, 4),
(18, 'Toques', TRUE, 5),
(19, 'Toques-EquiA', TRUE, 5),
(20, 'Toques-EquiB', TRUE, 5),
(21, 'ToquesDobles', TRUE, 5),
(22, 'Sets', TRUE, 6),
(23, 'Sets-JugA', TRUE, 6),
(24, 'Sets-JugB', TRUE, 6),
(25, 'Roturas-de-servicio', TRUE, 6),
(26, 'Aces', TRUE, 6),
(27, 'Sets', TRUE, 7),
(28, 'Sets-JugA', TRUE, 7),
(29, 'Sets-JugB', TRUE, 7),
(30, 'Faltas-de-saque', TRUE, 7),
(31, 'Asaltos', TRUE, 8),
(32, 'Ganador-JugA', TRUE, 8),
(33, 'Ganador-JugB', TRUE, 8),
(34, 'Golpes-lanzados', TRUE, 8);




-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;