define([],function(){"use strict";function ResourceLockInstance(){}return ResourceLockInstance.prototype.acquire=function(){this._isHeld=!0},ResourceLockInstance.prototype.isHeld=function(){return this._isHeld===!0},ResourceLockInstance.prototype.release=function(){this._isHeld=!1},ResourceLockInstance});