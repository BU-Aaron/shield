import "./Modules/Common/Http/bootstrap";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ContextMenuProvider } from "mantine-contextmenu";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-datatable/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import "mantine-contextmenu/styles.layer.css";
import "../css/layout.css";

import { theme } from "./Modules/Common/Themes/theme";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Initialize Laravel Echo
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
});

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider theme={theme}>
                <ContextMenuProvider>
                    <Notifications />
                    <App {...props} />
                </ContextMenuProvider>
            </MantineProvider>
        );

        delete el.dataset.page;
    },
    progress: {
        color: "#4B5563",
    },
});
