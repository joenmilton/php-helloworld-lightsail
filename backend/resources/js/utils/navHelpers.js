export const isAnyPathActive = (location, paths = []) => {
    return paths.some((path) => {
        if (path === "/") {
            return location.pathname === "/"; // Strict match for root
        }
        return location.pathname.startsWith(path);
    });
};