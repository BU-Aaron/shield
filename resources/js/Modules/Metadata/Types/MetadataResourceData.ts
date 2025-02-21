export type MetadataPredefinedValue = {
    id: number;
    predefined_value: string;
};

export type MetadataResourceData = {
    metadata_id: number;
    name: string;
    type: string;
    predefined_values: MetadataPredefinedValue[];
    value?: string;
};
