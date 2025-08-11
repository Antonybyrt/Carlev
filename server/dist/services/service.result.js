"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceResult = exports.ServiceErrorCode = void 0;
var ServiceErrorCode;
(function (ServiceErrorCode) {
    ServiceErrorCode[ServiceErrorCode["success"] = 0] = "success";
    ServiceErrorCode[ServiceErrorCode["failed"] = 1] = "failed";
    ServiceErrorCode[ServiceErrorCode["conflict"] = 2] = "conflict";
    ServiceErrorCode[ServiceErrorCode["notFound"] = 3] = "notFound";
    ServiceErrorCode[ServiceErrorCode["invalidParameter"] = 4] = "invalidParameter";
})(ServiceErrorCode || (exports.ServiceErrorCode = ServiceErrorCode = {}));
class ServiceResult {
    constructor(result, errorCode) {
        this.result = result;
        this.errorCode = errorCode;
    }
    static success(result) {
        return new ServiceResult(result, ServiceErrorCode.success);
    }
    static failed() {
        return new ServiceResult(undefined, ServiceErrorCode.failed);
    }
    static conflict() {
        return new ServiceResult(undefined, ServiceErrorCode.conflict);
    }
    static notFound() {
        return new ServiceResult(undefined, ServiceErrorCode.notFound);
    }
    static invalidParameter() {
        return new ServiceResult(undefined, ServiceErrorCode.invalidParameter);
    }
}
exports.ServiceResult = ServiceResult;
