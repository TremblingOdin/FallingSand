/*
 * Configuration setup for primary canvas
 *
 * Falling Sand is free software: you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License as Published by the Free Software Foundation, 
 * either version 3 of the license or any later version
 *
 * You should have received a copy of the GNU General Public license along wiht this program. 
 * If not, see https://www.gnu.org/licenses
 *
 * There are no warranties for this project, see the GNU Public License for mor details.
 */


const __max_width = 560;
const __max_height = 480;

const width = Math.min(__max_width, Math.max(screen.width - 6, 1));
const height = Math.min(__max_height, Math.max(screen.height - 200, 100));

const BASE_FPS = 60;
const MAX_PARTICLES = 1000;
