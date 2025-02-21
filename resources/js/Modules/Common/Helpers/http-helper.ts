import { CsrkTokenData } from "@/Modules/Item/Types/CsrkTokenData";
import { usePage } from "@inertiajs/react";

export async function httpGet(url: any) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    return await response.json();
}

export function httpPost(url: URL | RequestInfo, data: any) {
    const page = usePage<CsrkTokenData>();

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": page.props.csrf_token,
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                resolve(response.json());
            } else {
                response.json().then((data) => {
                    reject(new Error(JSON.stringify({ response, error: data })));
                });
            }
        });
    });
}