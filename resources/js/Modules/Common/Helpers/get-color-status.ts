export const getColorStatus = (state: string | undefined) => {
    if (!state) return "gray";

    if (state.startsWith("Approval")) {
        switch (state) {
            case "Approval Pending":
                return "orange";
            case "Approval Accepted":
                return "green";
            case "Approval Rejected":
                return "red";
            default:
                return "gray";
        }
    }

    if (state.startsWith("Reviewal")) {
        switch (state) {
            case "Reviewal Pending":
                return "orange";
            case "Reviewal Accepted":
                return "teal";
            case "Reviewal Rejected":
                return "red";
            default:
                return "gray";
        }
    }

    return "gray";
};