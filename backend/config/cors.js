const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",

    // Production
    "https://your-app.netlify.app",
    "https://*.netlify.app",
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests without an Origin
        // such as Postman, curl, server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        const isAllowed = allowedOrigins.some(
            (allowed) => {
                if (allowed.includes("*")) {
                    const pattern =
                        "^" +
                        allowed
                            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                            .replace("\\*", ".*") +
                        "$";

                    return new RegExp(pattern).test(
                        origin
                    );
                }

                return allowed === origin;
            }
        );

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    `CORS blocked origin: ${origin}`
                )
            );
        }
    },

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],

    credentials: true,
};

module.exports = corsOptions;