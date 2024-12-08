/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
module.exports = {
    darkMode: ["class"],
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    prefix: "",
    theme: {
        container: {
            center: "true",
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                playButtonHover: {
                    DEFAULT: "var(--play-button-hover)",
                    foreground: "var(--play-button-hover)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
                explode: {
                    "75%": {
                        transform: "scale(2)",
                        opacity: 0,
                    },
                    "90%": {
                        transform: "scale(2)",
                        opacity: 0,
                    },
                    "100%": {
                        transform: "scale(0)",
                        opacity: 0,
                    },
                },
                startUp: {
                    from: {
                        color: "hsl(var(--primary))",
                        opacity: 0,
                    },
                    to: {
                        opacity: 1,
                    },
                },
                playingNextSong: {
                    from: {
                        opacity: 0,
                    },
                    "100%": {
                        opacity: 1,
                        // top: "0",
                    },
                },
                bouncer: {
                    "10%": {
                        transform: "scaleY(0.3)" /* start by scaling to 30% */,
                    },
                    "30%": {
                        transform: `scaleY(1)` /* scale up to 100% */,
                    },

                    "60%": {
                        transform: `scaleY(0.5)` /* scale down to 50% */,
                    },

                    "80%": {
                        transform: `scaleY(0.75)` /* scale up to 75% */,
                    },

                    "100%": {
                        transform: `scaleY(0.6)` /* scale down to 60% */,
                    },
                },
                slideDown: {
                    from: { height: "0" },
                    to: { height: "var(--radix-collapsible-content-height)" },
                },
                slideUp: {
                    from: { height: "var(--radix-collapsible-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                slideDown: "slideDown 300ms ease-out",
                slideUp: "slideUp 300ms ease-out",
                playingNextSong: "playingNextSong 2000ms ease-out forwards",
                startUp: "startUp 500ms ease-out forwards",
                explosion: "explode 2s cubic-bezier(0,0,0.2,1) forwards",
                musicPlaying: "bouncer 2.2s ease infinite alternate",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
