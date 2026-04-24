// Base de datos de productos reales de Sego organizados por categoría
// Actualizado: Abril 2026

export const productosSego = [
  // CCTV - Cámaras IP
  { nombre: 'Cámara Domo IP 2MP 1080P Hikvision DS-2CD1123G0E-I', precio: '$ 65.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=Camara+Domo+IP' },
  { nombre: 'Cámara Bullet IP 4MP Dahua IPC-HFW1431S', precio: '$ 85.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=Camara+Bullet' },
  { nombre: 'Cámara PTZ IP 2MP Hikvision DS-2DE2A204IW-DE3', precio: '$ 450.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=PTZ' },
  { nombre: 'Cámara Fisheye 360° 5MP Dahua IPC-EBW81242', precio: '$ 320.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=Fisheye' },
  { nombre: 'Cámara Bullet IP 8MP 4K ColorVu Hikvision', precio: '$ 180.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=4K+ColorVu' },
  
  // CCTV - Cámaras Analógicas
  { nombre: 'Cámara Domo Analógica 1080P Hikvision DS-2CE56D0T', precio: '$ 35.00', categoria: 'CCTV - Cámaras Analógicas', imagen: 'https://via.placeholder.com/300x200?text=Domo+Analogica' },
  { nombre: 'Cámara Bullet Analógica 2MP Dahua HAC-HFW1200T', precio: '$ 40.00', categoria: 'CCTV - Cámaras Analógicas', imagen: 'https://via.placeholder.com/300x200?text=Bullet+Analogica' },
  { nombre: 'Cámara Turbo HD 5MP Hikvision DS-2CE16H0T-IT3F', precio: '$ 55.00', categoria: 'CCTV - Cámaras Analógicas', imagen: 'https://via.placeholder.com/300x200?text=Turbo+HD' },
  
  // CCTV - DVR/NVR
  { nombre: 'DVR 4 Canales 1080P Hikvision DS-7204HQHI-K1', precio: '$ 95.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=DVR+4CH' },
  { nombre: 'DVR 8 Canales 1080P Hikvision DS-7208HQHI-K1', precio: '$ 135.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=DVR+8CH' },
  { nombre: 'DVR 16 Canales 1080P Dahua XVR5116HS-I2', precio: '$ 220.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=DVR+16CH' },
  { nombre: 'NVR 8 Canales PoE 4K Hikvision DS-7608NI-K2/8P', precio: '$ 380.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=NVR+8CH' },
  { nombre: 'NVR 16 Canales 4K Dahua NVR4216-16P-4KS2', precio: '$ 650.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=NVR+16CH' },
  { nombre: 'NVR 32 Canales 4K Hikvision DS-7732NI-K4', precio: '$ 980.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=NVR+32CH' },
  
  // CCTV - Accesorios
  { nombre: 'Fuente de Poder 12V 5A para CCTV', precio: '$ 18.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Fuente+12V' },
  { nombre: 'Fuente de Poder 12V 10A 8 Salidas', precio: '$ 35.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Fuente+10A' },
  { nombre: 'Cable Coaxial RG59 305m', precio: '$ 85.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Cable+RG59' },
  { nombre: 'Conectores BNC Macho (Pack 100)', precio: '$ 25.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=BNC' },
  { nombre: 'Caja Hermética para Cámaras', precio: '$ 12.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Caja+Hermetica' },
  
  // CCTV - Soportes
  { nombre: 'Soporte de Pared para Cámara Domo', precio: '$ 8.00', categoria: 'CCTV - Soportes y Housings', imagen: 'https://via.placeholder.com/300x200?text=Soporte+Domo' },
  { nombre: 'Soporte de Pared para Cámara Bullet', precio: '$ 6.00', categoria: 'CCTV - Soportes y Housings', imagen: 'https://via.placeholder.com/300x200?text=Soporte+Bullet' },
  { nombre: 'Soporte de Poste para PTZ', precio: '$ 45.00', categoria: 'CCTV - Soportes y Housings', imagen: 'https://via.placeholder.com/300x200?text=Soporte+PTZ' },
  { nombre: 'Housing Antivandalico para Cámara', precio: '$ 35.00', categoria: 'CCTV - Soportes y Housings', imagen: 'https://via.placeholder.com/300x200?text=Housing' },
  
  // Alarmas contra Robo
  { nombre: 'Panel de Alarma DSC PC1616', precio: '$ 120.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Panel+DSC' },
  { nombre: 'Panel de Alarma DSC PC1832', precio: '$ 180.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Panel+1832' },
  { nombre: 'Detector de Movimiento PIR DSC LC-100-PI', precio: '$ 15.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=PIR' },
  { nombre: 'Detector PIR con Cámara DSC PG8934P', precio: '$ 85.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=PIR+Camara' },
  { nombre: 'Contacto Magnético Empotrable', precio: '$ 5.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Magnetico' },
  { nombre: 'Sirena Exterior con Flash DSC WS4945', precio: '$ 45.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Sirena' },
  { nombre: 'Teclado LCD DSC PK5501', precio: '$ 35.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Teclado' },
  { nombre: 'Batería 12V 7Ah para Panel de Alarma', precio: '$ 25.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Bateria' },
  
  // Alarmas contra Incendio
  { nombre: 'Central de Incendio Convencional 4 Zonas', precio: '$ 180.00', categoria: 'Alarmas contra Incendio', imagen: 'https://via.placeholder.com/300x200?text=Central+4Z' },
  { nombre: 'Central de Incendio Convencional 8 Zonas', precio: '$ 280.00', categoria: 'Alarmas contra Incendio', imagen: 'https://via.placeholder.com/300x200?text=Central+8Z' },
  { nombre: 'Detector de Humo Óptico Convencional', precio: '$ 18.00', categoria: 'Alarmas contra Incendio', imagen: 'https://via.placeholder.com/300x200?text=Detector+Humo' },
  { nombre: 'Detector de Temperatura Convencional', precio: '$ 20.00', categoria: 'Alarmas contra Incendio', imagen: 'https://via.placeholder.com/300x200?text=Detector+Temp' },
  { nombre: 'Pulsador de Alarma Rearmable', precio: '$ 12.00', categoria: 'Alarmas contra Incendio', imagen: 'https://via.placeholder.com/300x200?text=Pulsador' },
  { nombre: 'Sirena Campana Roja Contra Incendio', precio: '$ 25.00', categoria: 'Alarmas contra Incendio', imagen: 'https://via.placeholder.com/300x200?text=Campana' },
  
  // Control de Acceso
  { nombre: 'Controladora de Acceso 2 Puertas Hikvision DS-K2802', precio: '$ 180.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Controladora' },
  { nombre: 'Lector de Proximidad EM 125KHz', precio: '$ 25.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Lector+EM' },
  { nombre: 'Lector Biométrico Huella + Tarjeta', precio: '$ 120.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Biometrico' },
  { nombre: 'Cerradura Electromagnética 280Kg', precio: '$ 65.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Electromagnetica' },
  { nombre: 'Cerradura Electrica Strike 12V', precio: '$ 35.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Strike' },
  { nombre: 'Botón de Salida Infrarrojo Sin Contacto', precio: '$ 18.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Boton+Salida' },
  { nombre: 'Tarjetas de Proximidad EM (Pack 100)', precio: '$ 35.00', categoria: 'Control Acceso y Asistencia', imagen: 'https://via.placeholder.com/300x200?text=Tarjetas' },
  
  // Networking
  { nombre: 'Cable UTP Cat6 305m Nexxt', precio: '$ 95.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=Cable+Cat6' },
  { nombre: 'Cable UTP Cat5e 305m', precio: '$ 75.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=Cable+Cat5e' },
  { nombre: 'Switch PoE 8 Puertos Gigabit TP-Link', precio: '$ 120.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=Switch+8P' },
  { nombre: 'Switch PoE 16 Puertos Gigabit', precio: '$ 280.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=Switch+16P' },
  { nombre: 'Router WiFi 6 Dual Band TP-Link', precio: '$ 85.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=Router+WiFi6' },
  { nombre: 'Access Point WiFi 6 TP-Link', precio: '$ 95.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=AP+WiFi6' },
  { nombre: 'Conectores RJ45 Cat6 (Pack 100)', precio: '$ 18.00', categoria: 'Networking', imagen: 'https://via.placeholder.com/300x200?text=RJ45' },
  
  // Almacenamiento
  { nombre: 'Disco Duro 1TB Purple WD para Videovigilancia', precio: '$ 65.00', categoria: 'Almacenamiento', imagen: 'https://via.placeholder.com/300x200?text=HDD+1TB' },
  { nombre: 'Disco Duro 2TB Purple WD para Videovigilancia', precio: '$ 95.00', categoria: 'Almacenamiento', imagen: 'https://via.placeholder.com/300x200?text=HDD+2TB' },
  { nombre: 'Disco Duro 4TB Purple WD para Videovigilancia', precio: '$ 150.00', categoria: 'Almacenamiento', imagen: 'https://via.placeholder.com/300x200?text=HDD+4TB' },
  { nombre: 'Disco Duro 6TB Purple WD para Videovigilancia', precio: '$ 220.00', categoria: 'Almacenamiento', imagen: 'https://via.placeholder.com/300x200?text=HDD+6TB' },
  { nombre: 'SSD 240GB Kingston', precio: '$ 45.00', categoria: 'Almacenamiento', imagen: 'https://via.placeholder.com/300x200?text=SSD+240GB' },
  
  // Audio
  { nombre: 'Micrófono Ambiental para CCTV', precio: '$ 25.00', categoria: 'Audio', imagen: 'https://via.placeholder.com/300x200?text=Microfono' },
  { nombre: 'Altavoz de Techo 6W', precio: '$ 18.00', categoria: 'Audio', imagen: 'https://via.placeholder.com/300x200?text=Altavoz' },
  { nombre: 'Amplificador de Audio 60W', precio: '$ 85.00', categoria: 'Audio', imagen: 'https://via.placeholder.com/300x200?text=Amplificador' },
  
  // Monitores
  { nombre: 'Monitor LED 19" para CCTV', precio: '$ 120.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Monitor+19' },
  { nombre: 'Monitor LED 22" para CCTV', precio: '$ 150.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Monitor+22' },
  { nombre: 'Monitor LED 24" Full HD para CCTV', precio: '$ 180.00', categoria: 'CCTV - Accesorios', imagen: 'https://via.placeholder.com/300x200?text=Monitor+24' },
  
  // Kits
  { nombre: 'Kit 4 Cámaras + DVR Hikvision 1080P', precio: '$ 380.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=Kit+4+Camaras' },
  { nombre: 'Kit 8 Cámaras + DVR Hikvision 1080P', precio: '$ 650.00', categoria: 'CCTV', imagen: 'https://via.placeholder.com/300x200?text=Kit+8+Camaras' },
  { nombre: 'Kit Alarma Inalámbrica 8 Zonas', precio: '$ 180.00', categoria: 'Alarmas contra Robo', imagen: 'https://via.placeholder.com/300x200?text=Kit+Alarma' },
]
