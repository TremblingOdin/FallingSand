/* Configuration */
const ELEMENTS_PER_ROW = 4;
const PEN_SIZES = [2,4,8,16,32,64];
const PEN_SIZES_LABELS = ["1px", "2px", "4px", "8px", "16px", "32px"];
const DEFAULT_PEN_IDX = 1;

const elementMenuItems = [
    SAND, WATER, PLANT, FIRE, SPOUT,
    WELL, SALT, OIL, WAX, ICE, GUNPOWDER,
    SOIL, C4, LAVA, MYSTERY, CONCRETE, 
    BACKGROUND, BARRIER
];

const menuNames = {};
menuNames[SAND] = "SAND";
menuNames[WATER] = "WATER";
menuNames[PLANT] = "PLANT";
menuNames[FIRE] = "FIRE";
menuNames[SPOUT] = "SPOUT";
menuNames[WELL] = "WELL";
menuNames[SALT] = "SALT";
menuNames[OIL] = "OIL";
menuNames[WAX] = "WAX";
menuNames[ICE] = "ICE";
menuNames[GUNPOWDER] = "GUNPOWDER";
menuNames[SOIL] = "SOIL";
menuNames[C4] = "C4";
menuNames[LAVA] = "LAVA";
menuNames[MYSTERY] = "MYSTERY";
menuNames[CONCRETE] = "CONCRETE";
menuNames[BACKGROUND] = "BACKGROUND";
menuNames[BARRIER] = "BARRIER";

const menuAltColors = {};
menuAltColors[WATER] = "rgb(0,130,255)";
menuAltColors[BARRIER] = "rgb(255,255,255)";
menuAltColors[BACKGROUND] = "rgb(45,45,45)";
menuAltColors[WELL] = "rgb(158, 13, 33)";
menuAltColors[SOIL] = "rgb(171,110,53)";
