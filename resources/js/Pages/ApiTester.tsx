import { useState } from "react";
import { Box, Button, Select, TextInput, Textarea } from "@mantine/core";
import { JsonInput } from "@mantine/core";
import axios from "axios";

export default function ApiTester() {
    const [method, setMethod] = useState("GET");
    const [endpoint, setEndpoint] = useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        try {
            const config = {
                method,
                url: endpoint,
                data: jsonInput ? JSON.parse(jsonInput) : undefined,
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const res = await axios(config);
            setResponse(JSON.stringify(res.data, null, 2));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setResponse(JSON.stringify({
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                }, null, 2));
            } else if (error instanceof Error) {
                setResponse(error.message);
            } else {
                setResponse('An unknown error occurred');
            }
        }
    };

    return (
        <Box p={56}>
            <Select
                label="HTTP Method"
                value={method}
                onChange={(value) => setMethod(value as string)}
                data={["GET", "POST", "PUT", "DELETE"]}
            />
            <TextInput
                label="Endpoint"
                placeholder="/documents"
                value={endpoint}
                onChange={(event) => setEndpoint(event.currentTarget.value)}
            />
            <JsonInput
                label="JSON Input"
                placeholder='{ "key": "value" }'
                value={jsonInput}
                onChange={(value) => setJsonInput(value)}
                autosize
            />
            <Button onClick={handleSubmit} mt="md">
                Send Request
            </Button>
            <Textarea
                label="Response"
                value={response}
                readOnly
                autosize
                mt="md"
            />
        </Box>
    );
}