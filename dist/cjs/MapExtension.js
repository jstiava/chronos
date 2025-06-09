"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (!Map.prototype.getOrCreate) {
    Map.prototype.getOrCreate = function (key, createValue) {
        if (!this.has(key)) {
            this.set(key, createValue());
        }
        return this.get(key);
    };
}
