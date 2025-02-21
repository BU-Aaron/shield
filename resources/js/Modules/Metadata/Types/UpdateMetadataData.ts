import { MetadataPredefinedValue } from "./MetadataResourceData";

export type UpdateMetadataData = {
    name?: string;
    type?: string;
    predefined_values?: MetadataPredefinedValue[];
};
