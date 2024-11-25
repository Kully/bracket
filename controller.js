"use strict";

export const VALID_CONTROLLER_KEYS = [
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"KeyZ",
	"KeyX",
];
export const CONTROLLER = {};
for (let key of VALID_CONTROLLER_KEYS)
	CONTROLLER[key] = 0;
CONTROLLER["lastKeyUp"] = "";
CONTROLLER["lastKeyDown"] = "";

export function handleKeyDown(e) {
	for (let key of VALID_CONTROLLER_KEYS) {
		if (e.code === key)
		{
			CONTROLLER[key] = 1;
			CONTROLLER["lastKeyDown"] = key;
		}
	}
}
export function handleKeyUp(e) {
	for (let key of VALID_CONTROLLER_KEYS) {
		if (e.code === key) {
			CONTROLLER[key] = 0;
			CONTROLLER["lastKeyUp"] = key;
		}
	}
}