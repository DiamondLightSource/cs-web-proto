/* A simple context to provide a base url throughout the app. */
import React from "react";

export const DEFAULT_BASE_URL = "http://localhost:3000";

export const BaseUrlContext = React.createContext(DEFAULT_BASE_URL);
