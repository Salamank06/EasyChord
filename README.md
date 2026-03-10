# EasyChord - Buscador de Acordes

EasyChord es una aplicación interactiva desarrollada en Angular para la visualización y síntesis de acordes musicales. El proyecto se enfoca en la implementación de lógica matemática aplicada a la teoría musical y el uso de APIs nativas del navegador para la generación de sonido.

## Características Técnicas

- Renderizado Dinámico: Teclado de 24 teclas (2 octavas) que responde en tiempo real a la selección de acordes.
- Síntesis de Audio: Integración de Web Audio API para generar frecuencias mediante osciladores, eliminando la dependencia de archivos de audio externos.
- Lógica de Intervalos: Implementación de algoritmos basados en aritmética modular (Módulo 24) para calcular las notas de acordes mayores y menores a través de múltiples octavas.
- Gestión de Estado: Uso de servicios de Angular para centralizar la lógica de cálculo musical y la gestión del contexto de audio.

## Tecnologías Utilizadas

- Framework: Angular (Standalone Components)
- Lenguaje: TypeScript
- Audio: Web Audio API (OscillatorNode, GainNode, AudioContext)
- Estilos: CSS3 con metodologías de centrado dinámico y diseño responsivo

## Implementación de Ingeniería

El proyecto destaca por tres pilares fundamentales:

1. Optimización de Memoria: El servicio de música gestiona el ciclo de vida de los nodos de audio, realizando la desconexión del Master Gain tras la ejecución para prevenir fugas de memoria.
2. Precisión Acústica: Conversión de notas MIDI a frecuencias hertzianas mediante la fórmula de afinación temperada.
3. Reactividad: Vinculación de datos bidireccional para reflejar cambios en la teoría musical directamente sobre la interfaz de usuario.

## Instalación y Uso

1. Clonar el repositorio.
2. Ejecutar 'npm install' para instalar las dependencias.
3. Ejecutar 'ng serve' para iniciar el servidor de desarrollo.
4. Acceder a localhost:4200 en el navegador.

Este proyecto forma parte de un portafolio de desarrollo Frontend orientado a soluciones técnicas eficientes y escalables.
