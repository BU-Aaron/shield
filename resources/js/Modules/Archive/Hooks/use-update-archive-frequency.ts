import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";

interface UpdateArchiveFrequencyData {
    years: number;
    enabled: boolean;
}

interface UseUpdateArchiveFrequencyProps {
    onSuccessCallback: () => void;
}

export function useUpdateArchiveFrequency({
    onSuccessCallback,
}: UseUpdateArchiveFrequencyProps) {
    const { data, setData, put, processing, errors, reset } =
        useForm<UpdateArchiveFrequencyData>({
            years: 1,
            enabled: true,
        });

    const updateArchiveFrequency = () => {
        put(route("archive.frequency.updateYears"), {
            onSuccess: () => {
                notifications.show({
                    message: "Archive frequency updated successfully.",
                    color: "green",
                    position: "top-center",
                });
                onSuccessCallback();
                reset();
            },
            onError: (errors) => {
                notifications.show({
                    message: errors.years
                        ? errors.years[0]
                        : "An error occurred.",
                    color: "red",
                    position: "top-center",
                });
            },
        });
    };

    return {
        data,
        setData,
        updateArchiveFrequency,
        processing,
        errors,
    };
}
