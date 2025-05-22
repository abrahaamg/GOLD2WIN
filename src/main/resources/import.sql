-- INSERT DE USERS (username a, password aa)
INSERT INTO IWUser (ID, DINERO_DISPONIBLE, DINERO_RETENIDO, EMAIL, ENABLED, FIRST_NAME, LAST_NAME, PASSWORD, ROLES, USERNAME) VALUES
(1, 13055, 0, 'Jose_Luis@gmail.com', TRUE, 'Jose Luis', 'apellido1 apellido2', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'Jose Luis'),
(2, 13055, 0, 'ramon@gmail.com', TRUE, 'Ramon', 'apellido1 apellido2', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'Ramon'),
(3, 20000, 0, 'carlos.hernandez@example.com', TRUE, 'Carlos', 'Hernández Ruiz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'chernandez'),
(4, 5000, 0, 'ana.martinez@example.com', TRUE, 'Ana', 'Martínez Sánchez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'amartinez'),
(5, 30000, 0, 'luis.flores@example.com', TRUE, 'Luis', 'Flores Mendoza', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN', 'lflores'),
(6, 0, 0, 'sofia.rodriguez@example.com', TRUE, 'Sofía', 'Rodríguez Gómez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'srodriguez'),
(7, 12000, 0, 'andres.lopez@example.com', TRUE, 'Andrés', 'López Martínez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'alopez'),
(8, 8000, 0, 'carla.gomez@example.com', TRUE, 'Carla', 'Gómez García', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'cgomez'),
(9, 50000, 0, 'diego.sanchez@example.com', TRUE, 'Diego', 'Sánchez Pérez', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'dsanchez'),
(10, 6000, 0, 'lucia.ramirez@example.com', TRUE, 'Lucía', 'Ramírez Torres', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'lramirez'),
(11, 10000, 0, 'maria.garcia@example.com', TRUE, 'María', 'García López', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'mgarcia'),
(12, 0, 0, 'julianix882@gmail.com', TRUE, 'julián', 'Reguera Peñalosa', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN,USER', 'julianix'),
(13, 40000, 0, 'elena.fernandez@example.com', TRUE, 'Elena', 'Fernández Díaz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'efernandez'),
(14, 58000, 0, 'pedro.alvarez@example.com', TRUE, 'Pedro', 'Álvarez Ruiz', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'USER', 'palvarez'),
(15, 25000, 0, 'isabel.perez@example.com', TRUE, 'Isabel', 'Pérez López', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'ADMIN', 'iperez');


--INSERT DE SECCIONES
INSERT INTO SECCION (ID, ENABLED, GRUPO, NOMBRE) VALUES
(1, true, 'Deportes en Equipo', 'Futbol'),
(2, true, 'Deportes en Equipo', 'Baloncesto'),
(3, true, 'Deportes en Equipo', 'Beisbol'),
(4, true, 'Deportes en Equipo', 'Balonmano'),
(5, true, 'Deportes individuales', 'Esgrima'),
(6, true, 'Deportes individuales', 'Tenis'),
(7, true, 'Deportes individuales', 'Ping pong'),
(8, true, 'Deportes individuales', 'Boxeo'),
(9, true, 'eSports', 'League of Legends'),
(10, true, 'eSports', 'Counter Strike'),
(11, true, 'eSports', 'Valorant'),
(12, true, 'eSports', 'Overwatch'),
(13, true, 'eSports', 'Rocket League');


--------------------------- INSERT DE VARIABLES DE SECCIONES ---------------------------
--FUTBOL
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(1, 'GolesEquiA', TRUE, 1),
(2, 'GolesEquiB', TRUE, 1),
(3, 'CornersEquiA', TRUE, 1),
(4, 'CornersEquiB', TRUE, 1),
(5, 'AmarillasEquiA', TRUE, 1),
(6, 'AmarillasEquiB', TRUE, 1),
(7, 'FaltasEquiA', TRUE, 1),
(8, 'FaltasEquiB', TRUE, 1),
(9, 'TirosPuertaEquiA', TRUE, 1),
(10, 'TirosPuertaEquiB', TRUE, 1),
(11, 'TirosTotalesEquiA', TRUE, 1),
(12, 'TirosTotalesEquiB', TRUE, 1),
(13, 'RojasEquiA', TRUE, 1),
(14, 'RojasEquiB', TRUE, 1),
(15, 'PosesionEquiA', TRUE, 1),
(16, 'PosesionEquiB', TRUE, 1),
(17, 'EquipoConMasCorners', FALSE, 1),
(18, 'AmbosMarcan', FALSE, 1),
(19, 'GanadorPrimeraMitad', FALSE, 1),
(20, 'GanadorSegundaMitad', FALSE, 1);


--BALONCESTO
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(21, 'PuntosEquiA', TRUE, 2),
(22, 'PuntosEquiB', TRUE, 2),
(23, 'TriplesEquiA', TRUE, 2),
(24, 'TriplesEquiB', TRUE, 2),
(25, 'RebotesEquiA', TRUE, 2),
(26, 'RebotesEquiB', TRUE, 2),
(27, 'AsistenciasEquiA', TRUE, 2),
(28, 'AsistenciasEquiB', TRUE, 2),
(29, 'PérdidasEquiA', TRUE, 2),
(30, 'PérdidasEquiB', TRUE, 2),
(31, 'TaponesEquiA', TRUE, 2),
(32, 'TaponesEquiB', TRUE, 2),
(33, 'RobosEquiA', TRUE, 2),
(34, 'RobosEquiB', TRUE, 2),
(35, 'GanadorPrimerCuarto', FALSE, 2),
(36, 'GanadorSegundoCuarto', FALSE, 2),
(37, 'EmpateAlDescanso', FALSE, 2),
(38, 'EquipoMasFaltas', FALSE, 2),
(39, 'EquipoMasRobos', FALSE, 2),
(40, 'EquipoMasTriples', FALSE, 2);


--BEISBOL
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(41, 'CarrerasEquiA', TRUE, 3),
(42, 'CarrerasEquiB', TRUE, 3),
(43, 'HitsEquiA', TRUE, 3),
(44, 'HitsEquiB', TRUE, 3),
(45, 'ErroresEquiA', TRUE, 3),
(46, 'ErroresEquiB', TRUE, 3),
(47, 'HomeRunsEquiA', TRUE, 3),
(48, 'HomeRunsEquiB', TRUE, 3),
(49, 'BasesRobadasEquiA', TRUE, 3),
(50, 'BasesRobadasEquiB', TRUE, 3),
(51, 'PonchesLanzadorEquiA', TRUE, 3),
(52, 'PonchesLanzadorEquiB', TRUE, 3),
(53, 'BasesPorBolasEquiA', TRUE, 3),
(54, 'BasesPorBolasEquiB', TRUE, 3),
(55, 'GanadorPrimerEntrada', FALSE, 3),
(56, 'GanadorQuintaEntrada', FALSE, 3),
(57, 'EmpateAlFinalDelJuego', FALSE, 3),
(58, 'EquipoMasHits', FALSE, 3),
(59, 'EquipoConMasErrores', FALSE, 3),
(60, 'PrimeroEnAnotar', FALSE, 3);


--BALONMANO
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(61, 'GolesEquiA', TRUE, 4),
(62, 'GolesEquiB', TRUE, 4),
(63, 'ParadasEquiA', TRUE, 4),
(64, 'ParadasEquiB', TRUE, 4),
(65, 'Exclusiones2MinEquiA', TRUE, 4),
(66, 'Exclusiones2MinEquiB', TRUE, 4),
(67, 'PérdidasEquiA', TRUE, 4),
(68, 'PérdidasEquiB', TRUE, 4),
(69, 'RobosEquiA', TRUE, 4),
(70, 'RobosEquiB', TRUE, 4),
(71, 'LanzamientosTotalesEquiA', TRUE, 4),
(72, 'LanzamientosTotalesEquiB', TRUE, 4),
(73, 'PenaltisConvertidosEquiA', TRUE, 4),
(74, 'PenaltisConvertidosEquiB', TRUE, 4),
(75, 'GanadorPrimeraMitad', FALSE, 4),
(76, 'GanadorSegundaMitad', FALSE, 4),
(77, 'EmpateAlDescanso', FALSE, 4),
(78, 'PrimeroEnMarcar', FALSE, 4),
(79, 'EquipoMasExclusiones', FALSE, 4),
(80, 'EquipoMasParadas', FALSE, 4);


--ESGRIMA
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(81, 'ToquesJugA', TRUE, 5),
(82, 'ToquesJugB', TRUE, 5),
(83, 'PenalizacionesJugA', TRUE, 5),
(84, 'PenalizacionesJugB', TRUE, 5),
(85, 'ParadasJugA', TRUE, 5),
(86, 'ParadasJugB', TRUE, 5),
(87, 'TiemposMuertosJugA', TRUE, 5),
(88, 'TiemposMuertosJugB', TRUE, 5),
(89, 'PuntosRonda1JugA', TRUE, 5),
(90, 'PuntosRonda1JugB', TRUE, 5),
(91, 'PuntosRonda2JugA', TRUE, 5),
(92, 'PuntosRonda2JugB', TRUE, 5),
(93, 'PuntosRonda3JugA', TRUE, 5),
(94, 'PuntosRonda3JugB', TRUE, 5),
(95, 'Ganador', FALSE, 5),
(96, 'Empate', FALSE, 5),
(97, 'VictoriaPorPuntos', FALSE, 5),
(98, 'VictoriaPorRetiro', FALSE, 5),
(99, 'UltimoEnAnotar', FALSE, 5),
(100, 'TipoVictoria', FALSE, 5);


--TENIS
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(101, 'SetsJugA', TRUE, 6),
(102, 'SetsJugB', TRUE, 6),
(103, 'AcesJugA', TRUE, 6),
(104, 'AcesJugB', TRUE, 6),
(105, 'DoblesFaltasJugA', TRUE, 6),
(106, 'DoblesFaltasJugB', TRUE, 6),
(107, 'BreakPointsGanadosJugA', TRUE, 6),
(108, 'BreakPointsGanadosJugB', TRUE, 6),
(109, 'PuntosGanadosTotalesJugA', TRUE, 6),
(110, 'PuntosGanadosTotalesJugB', TRUE, 6),
(111, 'PrimerServicioAcertadoJugA', TRUE, 6),
(112, 'PrimerServicioAcertadoJugB', TRUE, 6),
(113, 'GanadorSet1', FALSE, 6),
(114, 'GanadorSet2', FALSE, 6),
(115, 'GanadorSet3', FALSE, 6),
(116, 'BreakEnPrimerJuego', FALSE, 6),
(117, 'TieBreakEnSet1', FALSE, 6),
(118, 'JugAConcedeSet', FALSE, 6),
(119, 'GanadorConHandicap', FALSE, 6),
(120, 'TotalSetsImpares', FALSE, 6);


--PING PONG
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(121, 'PuntosJugA', TRUE, 7),
(122, 'PuntosJugB', TRUE, 7),
(123, 'SetsJugA', TRUE, 7),
(124, 'SetsJugB', TRUE, 7),
(125, 'AcesJugA', TRUE, 7),
(126, 'AcesJugB', TRUE, 7),
(127, 'ErroresNoForzadosJugA', TRUE, 7),
(128, 'ErroresNoForzadosJugB', TRUE, 7),
(129, 'PuntosGanadosServicioJugA', TRUE, 7),
(130, 'PuntosGanadosServicioJugB', TRUE, 7),
(131, 'GanadorPrimerSet', FALSE, 7),
(132, 'GanadorSegundoSet', FALSE, 7),
(133, 'TotalSets', TRUE, 7),
(134, 'PrimerPunto', FALSE, 7),
(135, 'EmpateAlDescanso', FALSE, 7),
(136, 'JugadorConMasAces', FALSE, 7),
(137, 'GanadorConVentaja', FALSE, 7),
(138, 'TotalPuntosJugA', TRUE, 7),
(139, 'TotalPuntosJugB', TRUE, 7),
(140, 'GanadorFinal', FALSE, 7);


--BOXEO
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(141, 'AsaltosGanadosJugA', TRUE, 8),
(142, 'AsaltosGanadosJugB', TRUE, 8),
(143, 'GolpesLanzadosJugA', TRUE, 8),
(144, 'GolpesLanzadosJugB', TRUE, 8),
(145, 'GolpesConectadosJugA', TRUE, 8),
(146, 'GolpesConectadosJugB', TRUE, 8),
(147, 'KnockdownsJugA', TRUE, 8),
(148, 'KnockdownsJugB', TRUE, 8),
(149, 'FaltasJugA', TRUE, 8),
(150, 'FaltasJugB', TRUE, 8),
(151, 'PuntosJugA', TRUE, 8),
(152, 'PuntosJugB', TRUE, 8),
(153, 'GanadorPorKO', FALSE, 8),
(154, 'GanadorPorDecisión', FALSE, 8),
(155, 'Empate', FALSE, 8),
(156, 'RoundFinal', TRUE, 8),
(157, 'GolpesACabezaJugA', TRUE, 8),
(158, 'GolpesACabezaJugB', TRUE, 8),
(159, 'GolpesAlCuerpoJugA', TRUE, 8),
(160, 'GolpesAlCuerpoJugB', TRUE, 8);


--LEAGUE OF LEGENDS
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(161, 'KilsEquipoA', TRUE, 9),
(162, 'KilsEquipoB', TRUE, 9),
(163, 'MapasEquipoA', TRUE, 9),
(164, 'MapasEquipoB', TRUE, 9),
(165, 'MVP', FALSE, 9),
(166, 'TipoDragon', FALSE, 9),
(167, 'TorresTiradasEquipoA', TRUE, 9),
(168, 'TorresTiradasEquipoB', TRUE, 9),
(169, 'BotlaneGanadora', FALSE, 9),
(170, 'ToplaneGanadora', FALSE, 9),
(171, 'MidlaneGanadora', FALSE, 9),
(172, 'DiferenciaDeOro', TRUE, 9),
(173, 'DuracionMapa2', TRUE, 9),
(174, 'DuracionMapa3', TRUE, 9),
(175, 'DuracionMapa1', TRUE, 9),
(176, 'EquipoConMasObjetivos', FALSE, 9),
(177, 'PorcentajeFarmEquipoA', TRUE, 9),
(178, 'EquipoQueHizoBaron', FALSE, 9),
(179, 'CantidadHeraldosTomados', TRUE, 9),
(180, 'TorreFinalDestruida', FALSE, 9);

--COUNTER STRIKE
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(181, 'RondasEquipoA', TRUE, 10),
(182, 'RondasEquipoB', TRUE, 10),
(183, 'HeadshotsEquipoA', TRUE, 10),
(184, 'HeadshotsEquipoB', TRUE, 10),
(185, 'MayorAsistente', FALSE, 10),
(186, 'MVP', FALSE, 10),
(187, 'Mapa1', FALSE, 10),
(188, 'Mapa2', FALSE, 10),
(189, 'Mapa3', FALSE, 10),
(190, 'NumUtilidades', TRUE, 10),
(191, 'DuracionMapa1', TRUE, 10),
(192, 'DuracionMapa2', TRUE, 10),
(193, 'DuracionMapa3', TRUE, 10),
(194, 'PlantadasDeBomba', TRUE, 10),
(195, 'DefusadasExitosas', TRUE, 10),
(196, 'AcePorJugador', FALSE, 10),
(197, 'EquipoPrimeraBaja', FALSE, 10),
(198, 'KillMasRapida', FALSE, 10),
(199, 'EcoRoundGanado', FALSE, 10),
(200, 'NumeroSnipersUso', TRUE, 10);

--VALORANT
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(201, 'RondasEquipoA', TRUE, 11),
(202, 'RondasEquipoB', TRUE, 11),
(203, 'HeadshotsEquipoA', TRUE, 11),
(204, 'HeadshotsEquipoB', TRUE, 11),
(205, 'MayorAsistente', FALSE, 11),
(206, 'MVP', FALSE, 11),
(207, 'Mapa1', FALSE, 11),
(208, 'Mapa2', FALSE, 11),
(209, 'Mapa3', FALSE, 11),
(210, 'NumHabilidades', TRUE, 11),
(211, 'DuracionMapa1', TRUE, 11),
(212, 'DuracionMapa2', TRUE, 11),
(213, 'DuracionMapa3', TRUE, 11),
(214, 'PlantadasDeSpike', TRUE, 11),
(215, 'DesactivacionesExitosas', TRUE, 11),
(216, 'UsoDeUltiEquipoA', TRUE, 11),
(217, 'UsoDeUltiEquipoB', TRUE, 11),
(218, 'JugadorConMasUlti', FALSE, 11),
(219, 'AsesinatoPrimeraSangre', FALSE, 11),
(220, 'NumeroDeClutchs', TRUE, 11);


--OVERWATCH
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(221, 'PuntosEquipoA', TRUE, 12),
(222, 'PuntosEquipoB', TRUE, 12),
(223, 'MuertesEquipoA', TRUE, 12),
(224, 'MuertesEquipoB', TRUE, 12),
(225, 'AsistenciasEquipoA', TRUE, 12),
(226, 'AsistenciasEquipoB', TRUE, 12),
(227, 'UltimatesUsadosEquipoA', TRUE, 12),
(228, 'UltimatesUsadosEquipoB', TRUE, 12),
(229, 'TiempoControladoEquipoA', TRUE, 12),
(230, 'TiempoControladoEquipoB', TRUE, 12),
(231, 'PrimerPuntoCapturado', FALSE, 12),
(232, 'GanadorPrimeraRonda', FALSE, 12),
(233, 'GanadorSegundaRonda', FALSE, 12),
(234, 'GanadorTercerRonda', FALSE, 12),
(235, 'EquipoConMasMuertes', FALSE, 12),
(236, 'EquipoConMasUltimates', FALSE, 12),
(237, 'EquipoConMasAsistencias', FALSE, 12),
(238, 'MayorCantidadDeAsesinatos', FALSE, 12),
(239, 'EquipoConMejorPorcentajeDePrecision', FALSE, 12),
(240, 'GanadorFinal', FALSE, 12);


--ROCKET LEAGUE
INSERT INTO VARIABLE_SECCION (ID, NOMBRE, NUMERICO, ID_SECCION) VALUES
(241, 'GolesEquipoA', TRUE, 13),
(242, 'GolesEquipoB', TRUE, 13),
(243, 'PrimerEquipoEnMarcar', FALSE, 13),
(244, 'TirosAPuertaEquipo1', TRUE, 13),
(245, 'TirosAPuertaEquipo2', TRUE, 13),
(246, 'DemolicionesEquipoA', TRUE, 13),
(247, 'DemolicionesEquipoB', TRUE, 13),
(248, 'TurbosEquipoA', TRUE, 13),
(249, 'TurbosEquipoB', TRUE, 13),
(250, 'PrimerAnotador', FALSE, 13),
(251, 'PrimerGoleador', FALSE, 13),
(252, 'MVP', FALSE, 13),
(253, 'JuegosGanadosEquipoA', TRUE, 13),
(254, 'JuegosGanadosEquipoB', TRUE, 13),
(255, 'NumTiemposExtras', TRUE, 13),
(256, 'SalvadasEquipoA', TRUE, 13),
(257, 'SalvadasEquipoB', TRUE, 13),
(258, 'AsistenciasEquipoA', TRUE, 13),
(259, 'AsistenciasEquipoB', TRUE, 13),
(260, 'DuracionDelJuego', TRUE, 13);

--------------------INSERT DE EVENTO CON ETIQUETAS Y VARIABLES--------------------
-- FÚTBOL
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(1, false, false, '2025-06-10 18:00:00', '2025-03-01 12:00:00', 'La Liga: Celta de Vigo vs Osasuna', 1);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(1, 'Futbol'), (1, 'Liga'), (1, 'España'), (1, 'Deportes'), (1, 'Balón');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(261, 'GolesOsasuna', TRUE, NULL, 1),
(262, 'GolesCeltaDeVigo', TRUE, NULL, 1),
(263, 'CornersOsasuna', TRUE, NULL, 1),
(264, 'CornersCeltaDeVigo', TRUE, NULL, 1),
(265, 'AmarillasOsasuna', TRUE, NULL, 1),
(266, 'AmarillasCeltaDeVigo', TRUE, NULL, 1),
(267, 'FaltasOsasuna', TRUE, NULL, 1),
(268, 'FaltasCeltaDeVigo', TRUE, NULL, 1),
(269, 'TirosPuertaOsasuna', TRUE, NULL, 1),
(270, 'TirosPuertaCeltaDeVigo', TRUE, NULL, 1),
(271, 'TirosTotalesOsasuna', TRUE, NULL, 1),
(272, 'TirosTotalesCeltaDeVigo', TRUE, NULL, 1),
(273, 'RojasOsasuna', TRUE, NULL, 1),
(274, 'RojasCeltaDeVigo', TRUE, NULL, 1),
(275, 'PosesionOsasuna', TRUE, NULL, 1),
(276, 'PosesionCeltaDeVigo', TRUE, NULL, 1),
(277, 'EquipoConMasCorners', FALSE, NULL, 1),
(278, 'AmbosMarcan', FALSE, NULL, 1),
(279, 'GanadorPrimeraMitad', FALSE, NULL, 1),
(280, 'GanadorSegundaMitad', FALSE, NULL, 1);



-- BALONCESTO
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(2, false, false, '2025-07-11 20:30:00', '2025-03-02 10:00:00', 'NBA Playoffs: Los Angeles Lakers vs Boston Celtics', 2);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(2, 'Baloncesto'), (2, 'NBA'), (2, 'Estados Unidos'), (2, 'Deportes'), (2, 'Balón');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(281, 'PuntosLosAngelesLakers', TRUE, NULL, 2),
(282, 'PuntosBostonCeltics', TRUE, NULL, 2),
(283, 'TriplesLosAngelesLakers', TRUE, NULL, 2),
(284, 'TriplesBostonCeltics', TRUE, NULL, 2),
(285, 'RebotesLosAngelesLakers', TRUE, NULL, 2),
(286, 'RebotesBostonCeltics', TRUE, NULL, 2),
(287, 'AsistenciasLosAngelesLakers', TRUE, NULL, 2),
(288, 'AsistenciasBostonCeltics', TRUE, NULL, 2),
(289, 'PérdidasLosAngelesLakers', TRUE, NULL, 2),
(290, 'PérdidasBostonCeltics', TRUE, NULL, 2),
(291, 'TaponesLosAngelesLakers', TRUE, NULL, 2),
(292, 'TaponesBostonCeltics', TRUE, NULL, 2),
(293, 'RobosLosAngelesLakers', TRUE, NULL, 2),
(294, 'RobosBostonCeltics', TRUE, NULL, 2),
(295, 'GanadorPrimerCuarto', FALSE, NULL, 2),
(296, 'GanadorSegundoCuarto', FALSE, NULL, 2),
(297, 'EmpateAlDescanso', FALSE, NULL, 2),
(298, 'EquipoMasFaltas', FALSE, NULL, 2),
(299, 'EquipoMasRobos', FALSE, NULL, 2),
(300, 'EquipoMasTriples', FALSE, NULL, 2);



-- BEISBOL
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(3, false, false, '2025-06-12 19:00:00', '2025-03-03 14:00:00', 'MLB: New York Yankees vs Boston Red Sox', 3);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(3, 'Beisbol'), (3, 'MLB'), (3, 'Estados Unidos'), (3, 'Deportes'), (3, 'Bate');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(301, 'CarrerasNewYorkYankees', TRUE, NULL, 3),
(302, 'CarrerasBostonRedSox', TRUE, NULL, 3),
(303, 'HitsNewYorkYankees', TRUE, NULL, 3),
(304, 'HitsBostonRedSox', TRUE, NULL, 3),
(305, 'ErroresNewYorkYankees', TRUE, NULL, 3),
(306, 'ErroresBostonRedSox', TRUE, NULL, 3),
(307, 'HomeRunsNewYorkYankees', TRUE, NULL, 3),
(308, 'HomeRunsBostonRedSox', TRUE, NULL, 3),
(309, 'BasesRobadasNewYorkYankees', TRUE, NULL, 3),
(310, 'BasesRobadasBostonRedSox', TRUE, NULL, 3),
(311, 'PonchesLanzadorNewYorkYankees', TRUE, NULL, 3),
(312, 'PonchesLanzadorBostonRedSox', TRUE, NULL, 3),
(313, 'BasesPorBolasNewYorkYankees', TRUE, NULL, 3),
(314, 'BasesPorBolasBostonRedSox', TRUE, NULL, 3),
(315, 'GanadorPrimerEntrada', FALSE, NULL, 3),
(316, 'GanadorQuintaEntrada', FALSE, NULL, 3),
(317, 'EmpateAlFinalDelJuego', FALSE, NULL, 3),
(318, 'EquipoMasHits', FALSE, NULL, 3),
(319, 'EquipoConMasErrores', FALSE, NULL, 3),
(320, 'PrimeroEnAnotar', FALSE, NULL, 3);


-- BALONMANO
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(4, false, false, '2025-06-13 17:30:00', '2025-03-04 16:00:00', 'Champions League Balonmano: FC Barcelona vs Paris Saint-Germain', 4);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(4, 'Balonmano'), (4, 'Champions League'), (4, 'Europa'), (4, 'Deportes'), (4, 'Balón');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(321, 'GolesFCBarcelona', TRUE, NULL, 4),
(322, 'GolesParisSaintGermain', TRUE, NULL, 4),
(323, 'ParadasFCBarcelona', TRUE, NULL, 4),
(324, 'ParadasParisSaintGermain', TRUE, NULL, 4),
(325, 'Exclusiones2MinFCBarcelona', TRUE, NULL, 4),
(326, 'Exclusiones2MinParisSaintGermain', TRUE, NULL, 4),
(327, 'PérdidasFCBarcelona', TRUE, NULL, 4),
(328, 'PérdidasParisSaintGermain', TRUE, NULL, 4),
(329, 'RobosFCBarcelona', TRUE, NULL, 4),
(330, 'RobosParisSaintGermain', TRUE, NULL, 4),
(331, 'LanzamientosTotalesFCBarcelona', TRUE, NULL, 4),
(332, 'LanzamientosTotalesParisSaintGermain', TRUE, NULL, 4),
(333, 'PenaltisConvertidosFCBarcelona', TRUE, NULL, 4),
(334, 'PenaltisConvertidosParisSaintGermain', TRUE, NULL, 4),
(335, 'GanadorPrimeraMitad', FALSE, NULL, 4),
(336, 'GanadorSegundaMitad', FALSE, NULL, 4),
(337, 'EmpateAlDescanso', FALSE, NULL, 4),
(338, 'PrimeroEnMarcar', FALSE, NULL, 4),
(339, 'EquipoMasExclusiones', FALSE, NULL, 4),
(340, 'EquipoMasParadas', FALSE, NULL, 4);


-- ESGRIMA
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(13, false, false, '2025-06-14 15:00:00', '2025-03-05 09:00:00', 'Campeonato Mundial Esgrima: Juan Pérez vs Marco Rossi', 5);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(13, 'Esgrima'), (13, 'Campeonato Mundial'), (13, 'Individual'), (13, 'Deportes'), (13, 'Espada');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(341, 'ToquesJuanPerez', TRUE, NULL, 13),
(342, 'ToquesMarcoRossi', TRUE, NULL, 13),
(343, 'PenalizacionesJuanPerez', TRUE, NULL, 13),
(344, 'PenalizacionesMarcoRossi', TRUE, NULL, 13),
(345, 'ParadasJuanPerez', TRUE, NULL, 13),
(346, 'ParadasMarcoRossi', TRUE, NULL, 13),
(347, 'TiemposMuertosJuanPerez', TRUE, NULL, 13),
(348, 'TiemposMuertos-MarcoRossi', TRUE, NULL, 13),
(349, 'PuntosRonda1JuanPerez', TRUE, NULL, 13),
(350, 'PuntosRonda1MarcoRossi', TRUE, NULL, 13),
(351, 'PuntosRonda2JuanPerez', TRUE, NULL, 13),
(352, 'PuntosRonda2MarcoRossi', TRUE, NULL, 13),
(353, 'PuntosRonda3JuanPerez', TRUE, NULL, 13),
(354, 'PuntosRonda3MarcoRossi', TRUE, NULL, 13),
(355, 'Ganador', FALSE, NULL, 13),
(356, 'Empate', FALSE, NULL, 13),
(357, 'VictoriaPorPuntos', FALSE, NULL, 13),
(358, 'VictoriaPorRetiro', FALSE, NULL, 13),
(359, 'UltimoEnAnotar', FALSE, NULL, 13),
(360, 'TipoVictoria', FALSE, NULL, 13);


-- TENIS
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(6, false, false, '2025-06-15 13:00:00', '2025-03-06 11:00:00', 'Roland Garros: Rafael Nadal vs Novak Djokovic', 6);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(6, 'Tenis'), (6, 'Roland Garros'), (6, 'Grand Slam'), (6, 'Deportes'), (6, 'Raqueta');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(361, 'SetsRafaelNadal', TRUE, NULL, 6),
(362, 'SetsNovakDjokovic', TRUE, NULL, 6),
(363, 'AcesRafaelNadal', TRUE, NULL, 6),
(364, 'AcesNovakDjokovic', TRUE, NULL, 6),
(365, 'DoblesFaltasRafaelNadal', TRUE, NULL, 6),
(366, 'DoblesFaltasNovakDjokovic', TRUE, NULL, 6),
(367, 'BreakPointsGanadosRafaelNadal', TRUE, NULL, 6),
(368, 'BreakPointsGanadosNovakDjokovic', TRUE, NULL, 6),
(369, 'PuntosGanadosTotalesRafaelNadal', TRUE, NULL, 6),
(370, 'PuntosGanadosTotalesNovakDjokovic', TRUE, NULL, 6),
(371, 'PrimerServicioAcertadoRafaelNadal', TRUE, NULL, 6),
(372, 'PrimerServicioAcertadoNovakDjokovic', TRUE, NULL, 6),
(373, 'GanadorSet1', FALSE, NULL, 6),
(374, 'GanadorSet2', FALSE, NULL, 6),
(375, 'GanadorSet3', FALSE, NULL, 6),
(376, 'BreakEnPrimerJuego', FALSE, NULL, 6),
(377, 'TieBreakEnSet1', FALSE, NULL, 6),
(378, 'Rafael NadalConcedeSet', FALSE, NULL, 6),
(379, 'GanadorConHandicap', FALSE, NULL, 6),
(380, 'TotalSetsImpares', FALSE, NULL, 6);


-- PING PONG
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(7, false, false, '2025-06-16 12:00:00', '2025-03-07 10:00:00', 'Campeonato Mundial Ping Pong: Ma Long vs Fan Zhendong', 7);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(7, 'Ping Pong'), (7, 'Campeonato Mundial'), (7, 'Individual'), (7, 'Deportes'), (7, 'Raqueta');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(381, 'SetsMaLong', TRUE, NULL, 7),
(382, 'SetsFanZhendong', TRUE, NULL, 7),
(383, 'PuntosMaLong', TRUE, NULL, 7),
(384, 'PuntosFanZhendong', TRUE, NULL, 7),
(385, 'AcesMaLong', TRUE, NULL, 7),
(386, 'AcesFanZhendong', TRUE, NULL, 7),
(387, 'ErroresNoForzadosMaLong', TRUE, NULL, 7),
(388, 'ErroresNoForzadosFanZhendong', TRUE, NULL, 7),
(389, 'PuntosGanadosServicioMaLong', TRUE, NULL, 7),
(390, 'PuntosGanadosServicioFanZhendong', TRUE, NULL, 7),
(391, 'GanadorPrimerSet', FALSE, NULL, 7),
(392, 'GanadorSegundoSet', FALSE, NULL, 7),
(393, 'TotalSets', TRUE, NULL, 7),
(394, 'PrimerPunto', FALSE, NULL, 7),
(395, 'EmpateAlDescanso', FALSE, NULL, 7),
(396, 'MaLongdorConMasAces', FALSE, NULL, 7),
(397, 'GanadorConVentaja', FALSE, NULL, 7),
(398, 'TotalPuntosMaLong', TRUE, NULL, 7),
(399, 'TotalPuntosFanZhendong', TRUE, NULL, 7),
(400, 'GanadorFinal', FALSE, NULL, 7);


-- BOXEO
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(8, false, false, '2025-06-17 21:00:00', '2025-03-08 18:00:00', 'WBC Mundial: Canelo Álvarez vs Gennady Golovkin', 8);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(8, 'Boxeo'), (8, 'WBC'), (8, 'Campeonato Mundial'), (8, 'Deportes'), (8, 'Guantes');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(401, 'AsaltosGanadosCaneloAlvarez', TRUE, NULL, 8),
(402, 'AsaltosGanadosGennadyGolovkin', TRUE, NULL, 8),
(403, 'GolpesLanzadosCaneloAlvarez', TRUE, NULL, 8),
(404, 'GolpesLanzadosGennadyGolovkin', TRUE, NULL, 8),
(405, 'GolpesConectadosCaneloAlvarez', TRUE, NULL, 8),
(406, 'GolpesConectadosGennadyGolovkin', TRUE, NULL, 8),
(407, 'KnockdownsCaneloAlvarez', TRUE, NULL, 8),
(408, 'KnockdownsGennadyGolovkin', TRUE, NULL, 8),
(409, 'FaltasCaneloAlvarez', TRUE, NULL, 8),
(410, 'FaltasGennadyGolovkin', TRUE, NULL, 8),
(411, 'PuntosCaneloAlvarez', TRUE, NULL, 8),
(412, 'PuntosGennadyGolovkin', TRUE, NULL, 8),
(413, 'Ganador', FALSE, NULL, 8),
(414, 'VictoriaPorKO', FALSE, NULL, 8),
(415, 'VictoriaPorDecisión', FALSE, NULL, 8),
(416, 'VictoriaPorDescalificación', FALSE, NULL, 8),
(417, 'PrimerKnockdown', FALSE, NULL, 8),
(418, 'NúmeroDeKnockdownsTotales', TRUE, NULL, 8),
(419, 'DuraciónDelCombate', TRUE, NULL, 8),
(420, 'Empate', FALSE, NULL, 8);

-- LEAGUE OF LEGENDS
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(9, false, false, '2025-06-30 20:00:00', '2025-04-25 12:00:00', 'Worlds 2025: T1 vs G2 Esports', 9);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(9, 'LeagueOfLegends'), (9, 'Worlds'), (9, 'eSports'), (9, 'Corea'), (9, 'Europa');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(421, 'KillsT1', TRUE, NULL, 9),
(422, 'KillsG2Esports', TRUE, NULL, 9),
(423, 'MapasT1', TRUE, NULL, 9),
(424, 'MapasG2Esports', TRUE, NULL, 9),
(425, 'MVP', FALSE, NULL, 9),
(426, 'tipoDragon', FALSE, NULL, 9),
(427, 'TorresTiradasT1', TRUE, NULL, 9),
(428, 'TorresTiradasG2Esports', TRUE, NULL, 9),
(429, 'BotlaneGanadora', FALSE, NULL, 9),
(430, 'ToplaneGanadora', FALSE, NULL, 9),
(431, 'MidlaneGanadora', FALSE, NULL, 9),
(432, 'DiferenciaDeOro', TRUE, NULL, 9),
(433, 'DuracionMapa2', TRUE, NULL, 9),
(434, 'DuracionMapa3', TRUE, NULL, 9),
(435, 'DuracionMapa1', TRUE, NULL, 9),
(436, 'EquipoConMasObjetivos', FALSE, NULL, 9),
(437, 'PorcentajeFarmT1', TRUE, NULL, 9),
(438, 'EquipoQueHizoBaron', FALSE, NULL, 9),
(439, 'CantidadHeraldosTomados', TRUE, NULL, 9),
(440, 'TorreFinalDestruida', FALSE, NULL, 9);



--COUNTER STRIKE
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(10, false, false, '2025-11-10 20:00:00', '2025-05-22 12:00:00', 'PGL Major Copenhague Final: NAVI vs FaZe Clan', 10);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(10, 'Esports'), (10, 'CS2'), (10, 'Counter-Strike'), (10, 'PGL Major'), (10, 'Final'), (10, 'NAVI'), (10, 'FaZe Clan');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(441, 'RondasNAVI', TRUE, NULL, 10),
(442, 'RondasFaZeClan', TRUE, NULL, 10),
(443, 'HeadshotsNAVI', TRUE, NULL, 10),
(444, 'HeadshotsFaZeClan', TRUE, NULL, 10),
(445, 'MayorAsistente', FALSE, NULL, 10),
(446, 'MVP', FALSE, NULL, 10),
(447, 'Mapa1', FALSE, NULL, 10),
(448, 'Mapa2', FALSE, NULL, 10),
(449, 'Mapa3', FALSE, NULL, 10),
(450, 'NumUtilidades', TRUE, NULL, 10),
(451, 'DuracionMapa1', TRUE, NULL, 10),
(452, 'DuracionMapa2', TRUE, NULL, 10),
(453, 'DuracionMapa3', TRUE, NULL, 10),
(454, 'PlantadasDeBomba', TRUE, NULL, 10),
(455, 'DefusadasExitosas', TRUE, NULL, 10),
(456, 'AcePorJugador', FALSE, NULL, 10),
(457, 'EquipoPrimeraBaja', FALSE, NULL, 10),
(458, 'KillMasRapida', FALSE, NULL, 10),
(459, 'EcoRoundGanado', FALSE, NULL, 10),
(460, 'NumeroSnipersUso', TRUE, NULL, 10);


--VALORANT
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(11, false, false, '2025-08-25 20:30:00', '2025-05-22 12:00:00', 'Valorant Champions Final: FNATIC vs Paper Rex', 11);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(11, 'Esports'), (11, 'Valorant'), (11, 'Champions'), (11, 'Final'), (11, 'FNATIC'), (11, 'Paper Rex');

-- VARIABLES EVENTO: Valorant Champions Final: FNATIC vs Paper Rex
INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(461, 'RondasFNATIC', TRUE, NULL, 11),
(462, 'RondasPaperRex', TRUE, NULL, 11),
(463, 'HeadshotsFNATIC', TRUE, NULL, 11),
(464, 'HeadshotsPaperRex', TRUE, NULL, 11),
(465, 'MayorAsistente', FALSE, NULL, 11),
(466, 'MVP', FALSE, NULL, 11),
(467, 'Mapa1', FALSE, NULL, 11),
(468, 'Mapa2', FALSE, NULL, 11),
(469, 'Mapa3', FALSE, NULL, 11),
(470, 'NumHabilidades', TRUE, NULL, 11),
(471, 'DuracionMapa1', TRUE, NULL, 11),
(472, 'DuracionMapa2', TRUE, NULL, 11),
(473, 'DuracionMapa3', TRUE, NULL, 11),
(474, 'PlantadasDeSpike', TRUE, NULL, 11),
(475, 'DesactivacionesExitosas', TRUE, NULL, 11),
(476, 'UsoDeUltiFNATIC', TRUE, NULL, 11),
(477, 'UsoDeUltiPaperRex', TRUE, NULL, 11),
(478, 'JugadorConMasUlti', FALSE, NULL, 11),
(479, 'AsesinatoPrimeraSangre', FALSE, NULL, 11),
(480, 'NumeroDeClutchs', TRUE, NULL, 11);


--OVERWATCH
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(11, false, false, '2025-09-14 22:00:00', '2025-05-22 12:00:00', 'Overwatch League Grand Final: Atlanta Reign vs Houston Outlaws', 12);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(11, 'Esports'), (11, 'Overwatch'), (11, 'OWL'), (11, 'Final'), (11, 'Atlanta Reign'), (11, 'Houston Outlaws');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(481, 'PuntosAtlantaReign', TRUE, NULL, 12),
(482, 'PuntosHoustonOutlaws', TRUE, NULL, 12),
(483, 'MuertesAtlantaReign', TRUE, NULL, 12),
(484, 'MuertesHoustonOutlaws', TRUE, NULL, 12),
(485, 'AsistenciasAtlantaReign', TRUE, NULL, 12),
(486, 'AsistenciasHoustonOutlaws', TRUE, NULL, 12),
(487, 'UltimatesUsadosAtlantaReign', TRUE, NULL, 12),
(488, 'UltimatesUsadosHoustonOutlaws', TRUE, NULL, 12),
(489, 'TiempoControladoAtlantaReign', TRUE, NULL, 12),
(490, 'TiempoControladoHoustonOutlaws', TRUE, NULL, 12),
(491, 'PrimerPuntoCapturado', FALSE, NULL, 12),
(492, 'GanadorPrimeraRonda', FALSE, NULL, 12),
(493, 'GanadorSegundaRonda', FALSE, NULL, 12),
(494, 'GanadorTercerRonda', FALSE, NULL, 12),
(495, 'EquipoConMasMuertes', FALSE, NULL, 12),
(496, 'EquipoConMasUltimates', FALSE, NULL, 12),
(497, 'EquipoConMasAsistencias', FALSE, NULL, 12),
(498, 'MayorCantidadDeAsesinatos', FALSE, NULL, 12),
(499, 'EquipoConMejorPorcentajeDePrecision', FALSE, NULL, 12),
(500, 'GanadorFinal', FALSE, NULL, 12);

--ROCKET LEAGUE
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(12, false, false, '2025-07-28 18:00:00', '2025-05-22 12:00:00', 'RLCS World Championship Final: Team BDS vs Gen.G Mobil1 Racing', 12);

INSERT INTO EVENTO_ETIQUETAS (EVENTO_ID, ETIQUETAS) VALUES
(12, 'Esports'), (12, 'Rocket League'), (12, 'RLCS'), (12, 'Final'), (12, 'Team BDS'), (12, 'Gen.G Mobil1');

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(501, 'GolesTeamBDS', TRUE, NULL, 12),
(502, 'GolesGenGMobil1', TRUE, NULL, 12),
(503, 'PrimerEquipoEnMarcar', FALSE, NULL, 12),
(504, 'TirosAPuertaTeamBDS', TRUE, NULL, 12),
(505, 'TirosAPuertaGenGMobil1', TRUE, NULL, 12),
(506, 'DemolicionesTeamBDS', TRUE, NULL, 12),
(507, 'DemolicionesGenGMobil1', TRUE, NULL, 12),
(508, 'TurbosTeamBDS', TRUE, NULL, 12),
(509, 'TurbosGenGMobil1', TRUE, NULL, 12),
(510, 'PrimerAnotador', FALSE, NULL, 12),
(511, 'PrimerGoleador', FALSE, NULL, 12),
(512, 'MVP', FALSE, NULL, 12),
(513, 'JuegosGanadosTeamBDS', TRUE, NULL, 12),
(514, 'JuegosGanadosGenGMobil1', TRUE, NULL, 12),
(515, 'NumTiemposExtras', TRUE, NULL, 12),
(516, 'SalvadasTeamBDS', TRUE, NULL, 12),
(517, 'SalvadasGenGMobil1', TRUE, NULL, 12),
(518, 'AsistenciasTeamBDS', TRUE, NULL, 12),
(519, 'AsistenciasGenGMobil1', TRUE, NULL, 12),
(520, 'DuracionDelJuego', TRUE, NULL, 12);

--Insert para prueba determinar evento
INSERT INTO EVENTO (ID, CANCELADO, DETERMINADO, FECHA_CIERRE, FECHA_CREACION, NOMBRE, SECCION_ID) VALUES
(5, FALSE, FALSE, '2025-04-03 15:00:00', '2025-01-02 08:00:00', 'Campeonato Mundial de Esgrima', 5);

INSERT INTO VARIABLE (ID, NOMBRE, NUMERICO, RESOLUCION, ID_EVENTO) VALUES
(701, 'ToquesJugA', TRUE, NULL, 5),
(702, 'ToquesJugB', TRUE, NULL, 5),
(703, 'PenalizacionesJugA', TRUE, NULL, 5),
(704, 'PenalizacionesJugB', TRUE, NULL, 5);

INSERT INTO FORMULA_APUESTA 
    (ID, DINERO_AFAVOR, DINERO_EN_CONTRA, FORMULA, NOMBRE, RESULTADO, CREADOR_ID, EVENTO_ID, FECHA_CREACION)
VALUES
(500, 3000, 2000, 'ToquesJugA > 2', 'Toques', 'INDETERMINADO', 1, 5, '2025-03-22 14:53:00');

INSERT INTO APUESTA (ID, CANTIDAD, A_FAVOR, APOSTADOR_ID, FORMULA, FECHA_CREACION) VALUES
(700, 5000, TRUE, 2, 500, '2025-03-22T14:53:00+01:00'),
(701, 3000, FALSE, 2, 500, '2025-03-22T14:53:00+01:00');

-- COPIADO PEGADO DEL ANTERIOR IMPORT.SQL:

-- INSERT FORMULA_APUESTA con FECHA_CREACION
INSERT INTO FORMULA_APUESTA 
    (ID, DINERO_AFAVOR, DINERO_EN_CONTRA, FORMULA, NOMBRE, RESULTADO, CREADOR_ID, EVENTO_ID, FECHA_CREACION)
VALUES
(1, 5000, 0, 'GolesCeltaDeVigo > GolesOsasuna', 'Gana Celta de Vigo', 'INDETERMINADO', 1, 1, '2025-05-22 12:00:00'),
(2, 0, 3000, 'CornersOsasuna > CornersCeltaDeVigo', 'Más corners Osasuna', 'INDETERMINADO', 1, 1, '2025-05-22 12:00:00'),
(3, 7505, 0, 'TriplesLosAngelesLakers > TriplesBostonCeltics', 'Más triples Lakers', 'INDETERMINADO', 2, 2, '2025-05-22 12:00:00'),
(4, 0, 2000, 'PuntosBostonCeltics > PuntosLosAngelesLakers', 'Gana Boston Celtics', 'INDETERMINADO', 2, 2, '2025-05-22 12:00:00');

-- INSERT APUESTA con FECHA_CREACION en formato OffsetDateTime
INSERT INTO APUESTA (ID, CANTIDAD, A_FAVOR, APOSTADOR_ID, FORMULA, FECHA_CREACION) VALUES
(1, 5000, TRUE, 1, 1, '2025-03-22T14:53:00+01:00'),
(2, 3000, FALSE, 2, 2, '2025-03-22T14:53:00+01:00'),
(3, 7505, TRUE, 3, 3, '2025-03-22T14:53:00+01:00'),
(4, 2000, FALSE, 4, 4, '2025-03-22T14:53:00+01:00'),
(5, 500, FALSE, 3, 1, '2025-03-22T14:53:00+01:00'),
(6, 800, TRUE, 4, 2, '2025-03-22T14:53:00+01:00'),
(7, 1050, FALSE, 1, 3, '2025-03-22T14:53:00+01:00'),
(8, 234, TRUE, 2, 4, '2025-03-22T14:53:00+01:00');



INSERT INTO PARTICIPACION_CHAT (EVENTO_ID, ULTIMA_VISITA, USUARIO_ID) VALUES
(4, '1000-01-01 00:00:00', 11),
(8, '1000-01-01 00:00:00', 11),
(11, '1000-01-01 00:00:00', 11),
(4, '1000-01-01 00:00:00', 12),
(8, '1000-01-01 00:00:00', 12),
(11, '1000-01-01 00:00:00', 12);

INSERT INTO MENSAJE (ENABLED, FECHA_ENVIO, ID, ID_EVENTO, REMITENTE, CONTENIDO) VALUES
(1, '2025-05-03 08:15:00', 1, 4, 11, 'Mensaje enviado por el usuario 11 en el evento 4'),
(1, '2025-05-03 09:30:00', 2, 8, 11, 'Mensaje enviado por el usuario 11 en el evento 8'),
(1, '2025-05-03 10:45:00', 3, 11, 11, 'Mensaje enviado por el usuario 11 en el evento 11'),
(1, '2025-05-03 11:00:00', 4, 4, 12, 'Mensaje enviado por el usuario 12 en el evento 4'),
(1, '2025-05-03 12:15:00', 5, 8, 12, 'Mensaje enviado por el usuario 12 en el evento 8'),
(1, '2025-05-03 13:30:00', 6, 11, 12, 'Mensaje enviado por el usuario 12 en el evento 11'),
(1, '2025-03-02 14:00:00', 7, 4, 11, 'Mensaje enviado por el usuario 11 en el evento 4'),
(1, '2025-03-02 15:15:00', 8, 8, 11, 'Mensaje enviado por el usuario 11 en el evento 8'),
(1, '2025-03-02 16:30:00', 9, 11, 11, 'Mensaje enviado por el usuario 11 en el evento 11'),
(1, '2025-03-02 17:00:00', 10, 4, 12, 'Mensaje enviado por el usuario 12 en el evento 4'),
(1, '2025-03-02 18:15:00', 11, 8, 12, 'Mensaje enviado por el usuario 12 en el evento 8'),
(1, '2025-03-02 19:30:00', 12, 11, 12, 'Mensaje enviado por el usuario 12 en el evento 11');

INSERT INTO REPORTE (RESUELTO, FECHA_ENVIO, FECHA_RESOLUCION, ID, ID_MENSAJE, ID_REPORTADOR, MOTIVO)
VALUES 
(FALSE, '2025-05-01', NULL, 1, 1, 2, 'Contenido ofensivo en el mensaje'),
(FALSE, '2025-05-02', NULL, 2, 2, 3, 'Spam repetitivo detectado'),
(TRUE, '2025-04-28', '2025-05-03', 3, 3, 4, 'Manipulación de resultados en mensaje'),
(TRUE, '2025-04-20', '2025-04-22', 4, 4, 5, 'Lenguaje inapropiado'),
(FALSE, '2025-05-03', NULL, 5, 5, 2, 'Incitación al odio'),
(TRUE, '2025-04-15', '2025-04-18', 6, 6, 6, 'Publicidad no solicitada'),
(FALSE, '2025-05-04', NULL, 7, 7, 3, 'Amenazas en el mensaje'),
(TRUE, '2025-04-10', '2025-04-12', 8, 8, 7, 'Suplantación de identidad'),
(FALSE, '2025-05-04', NULL, 9, 9, 4, 'Contenido falso'),
(FALSE, '2025-05-04', NULL, 10, 10, 5, 'Contenido explícito sin aviso'),
(TRUE, '2025-04-01', '2025-04-05', 11, 11, 8, 'Violación de normas comunitarias'),
(TRUE, '2025-03-28', '2025-03-30', 12, 12, 9, 'Abuso verbal en conversación');

-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;