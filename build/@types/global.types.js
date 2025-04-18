"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUser = exports.onlyUser = exports.onlyAdmin = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
exports.onlyAdmin = [Role.ADMIN];
exports.onlyUser = [Role.USER];
exports.allUser = [Role.ADMIN, Role.USER];
