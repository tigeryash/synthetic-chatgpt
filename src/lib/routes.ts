/*
An array of routes that are acccessible to the public.
these routes do not require authentication.
    @type {string[]}
*/

export const publicRoutes = ["/login"];

/*
An array of routes that are use for authentication.
these routes will redirect logged in users to /settings
    @type {string[]}
*/

export const authRoutes = ["/login"];

/*
the prefix for API authenication routes
toutes that start with this prefix are used for API authentication purposes
    @type {string}
*/

export const apiAuthPrefix = "/api/auth";

/*
the  default redirect path after loggin in 
    @type {string}
*/

export const DEFAULT_LOGIN_REDIRECT = "/chat";
