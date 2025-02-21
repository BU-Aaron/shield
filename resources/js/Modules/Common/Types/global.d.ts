import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";
import Pusher from "pusher-js";

declare global {
    interface Window {
        axios: AxiosInstance;
        Pusher: typeof Pusher;
    }

    var route: typeof ziggyRoute;
}
