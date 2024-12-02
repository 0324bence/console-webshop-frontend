function isAuthorized(promise: Response) {
    if (promise.status === 401) {
        return false;
    }
    return true;
}
