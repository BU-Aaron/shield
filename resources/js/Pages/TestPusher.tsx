import { useEffect, useState } from "react";
import Echo from "laravel-echo";

export default function TestPusher() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        echo.channel("test-channel").listen("TestPusherEvent", (e: any) => {
            setMessages((prev) => [...prev, e.message]);
        });

        return () => {
            echo.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Test Pusher Event</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
