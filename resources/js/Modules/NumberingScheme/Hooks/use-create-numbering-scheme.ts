import { FormEventHandler, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { notifications } from "@mantine/notifications";
import { CreateNumberingSchemeData } from "../Types/CreateNumberingSchemeData";
import { ItemParentResourceData } from "@/Modules/Item/Types/ItemParentResourceData";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";

interface IProps {
    itemParent?: ItemParentResourceData;
}

export function useCreateNumberingScheme({ itemParent }: IProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<CreateNumberingSchemeData>({
            folder_item_id: itemParent?.item_id ?? "",
            name: "",
            prefix: "",
            next_number: 1,
            reset_frequency: "none",
            add_if_approved: false,
        });

    const { closeModal } = useModalStore();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const formattedPrefix = formatPrefix(data.prefix);
        setData("prefix", formattedPrefix);

        post(route("numbering-scheme.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal("createNumberingScheme");
                notifications.show({
                    position: "top-center",
                    message: "Numbering scheme created",
                    color: "green",
                });
            },
            onError: (errors) => {
                notifications.show({
                    position: "top-center",
                    message: "Something went wrong",
                    color: "red",
                });
            },
            onFinish: () => reset(),
        });
    };

    const formatPrefix = (prefix: string): string => {
        return prefix;
    };

    return { data, setData, handleSubmit, processing, errors };
}
