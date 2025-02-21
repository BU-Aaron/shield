import {
    ActionIcon,
    Avatar,
    Button,
    Flex,
    Group,
    Modal,
    Paper,
    Radio,
    Stack,
    Text,
    Textarea,
    Select,
} from "@mantine/core";
import useModalStore from "@/Modules/Common/Hooks/use-modal-store";
import { useUpdateDocumentApproval } from "../Hooks/use-update-document-approval";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { DocumentResourceData } from "@/Modules/Document/Types/DocumentResourceData";
import ConfirmDeleteDocumentApprovalForm from "./ConfirmDeleteDocumentApprovalForm";
import { StatusIcon } from "@/Modules/Common/Components/StatusIcon/StatusIcon";
import { useUpdateDocumentReview } from "../Hooks/use-update-document-review";
import ConfirmDeleteDocumentReviewForm from "./ConfirmDeleteDocumentReviewForm";

interface IFormProps {
    document?: DocumentResourceData;
}

const ViewDocumentReviewForm: React.FC<IFormProps> = ({ document }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals["viewDocumentReview"];

    // Assuming you want to handle the first approval for simplicity
    const documentApprovalId = document?.document_approval_ids?.find(
        (approval) => approval.type === "reviewal"
    )?.id;

    const {
        data,
        setData,
        handleUpdateDocumentApproval,
        processing,
        errors,
        users,
        setDocumentApprovalType,
        addUser,
        removeUser,
        handleUserChange,
        addAllUsers,
        documentApproval,
        maxUsers,
        selectedUserIds,
        fetchedUsers,
    } = useUpdateDocumentReview({
        documentApprovalId,
        isOpen,
    });

    // Function to generate options for each Select, excluding already selected users
    const getOptions = (currentIndex: number) => {
        return fetchedUsers
            .filter(
                (user) =>
                    !selectedUserIds.includes(user.id.toString()) ||
                    user.id.toString() === users[currentIndex].selectedUser
            )
            .map((user) => ({
                value: user.id.toString(),
                label: `${user.name} (${user.email})`,
            }));
    };

    // Determine if any user has made a decision
    const hasDecisionMade = documentApproval?.document_user_approvals.some(
        (ua) =>
            [
                "Reviewal Accepted",
                "Reviewal Rejected",
                "Approval Accepted",
                "Approval Rejected",
            ].includes(ua.user_state)
    );

    // Determine if all users have made decisions
    const allUsersDecided = documentApproval?.document_user_approvals.every(
        (ua) =>
            [
                "Reviewal Accepted",
                "Reviewal Rejected",
                "Approval Accepted",
                "Approval Rejected",
            ].includes(ua.user_state)
    );

    return (
        <>
            <Modal
                opened={isOpen}
                onClose={() => closeModal("viewDocumentReview")}
                title={
                    <Text fw="bold" size="lg">
                        Document Review Workflow Process
                    </Text>
                }
                size={550}
            >
                <form onSubmit={handleUpdateDocumentApproval}>
                    <Stack gap={16}>
                        <Text size="sm">
                            View the document workflow process for this document
                        </Text>

                        {!hasDecisionMade && (
                            <Radio.Group
                                name="status"
                                value={data.type}
                                onChange={(value: string) => {
                                    setData("type", value);
                                    setDocumentApprovalType(value);
                                }}
                                hidden
                            >
                                <Group mt="xs">
                                    <Radio value="reviewal" label="Review" />
                                    <Radio value="approval" label="Approval" />
                                </Group>
                            </Radio.Group>
                        )}

                        <Textarea
                            label="Resolution"
                            placeholder="Your resolution for this approval"
                            value={data.resolution ?? ""}
                            onChange={(e) =>
                                setData("resolution", e.target.value)
                            }
                            error={errors.resolution}
                            autosize
                            minRows={2}
                            maxRows={4}
                            readOnly={hasDecisionMade}
                        />

                        <Text size="sm" fw={500} mb={-8}>
                            Users in this document approval
                        </Text>

                        {users.map((user, index) => {
                            const userApproval =
                                documentApproval?.document_user_approvals.find(
                                    (ua) =>
                                        ua.user_id.toString() ===
                                        user.selectedUser
                                );

                            const isDecided =
                                userApproval &&
                                [
                                    "Reviewal Accepted",
                                    "Reviewal Rejected",
                                    "Approval Accepted",
                                    "Approval Rejected",
                                ].includes(userApproval.user_state);

                            return (
                                <Group
                                    key={index}
                                    justify="space-between"
                                    align="flex-end"
                                >
                                    <Group>
                                        <StatusIcon
                                            state={userApproval?.user_state}
                                        />
                                    </Group>
                                    <Select
                                        placeholder="Select a user"
                                        data={getOptions(index)}
                                        value={user.selectedUser}
                                        onChange={(value) =>
                                            handleUserChange(index, value)
                                        }
                                        required={!isDecided}
                                        style={{ flex: 1 }}
                                        allowDeselect={!isDecided}
                                        readOnly={isDecided}
                                    />
                                    {!isDecided && (
                                        <ActionIcon
                                            color="red"
                                            onClick={() => removeUser(index)}
                                            title="Remove User"
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            );
                        })}

                        {!allUsersDecided && (
                            <Group>
                                {users.length < maxUsers && (
                                    <Button
                                        variant="subtle"
                                        color="green"
                                        leftSection={<IconPlus size={16} />}
                                        onClick={addUser}
                                        disabled={users.length >= maxUsers}
                                    >
                                        Add User
                                    </Button>
                                )}

                                {selectedUserIds.length < maxUsers && (
                                    <Button
                                        variant="subtle"
                                        color="blue"
                                        leftSection={<IconPlus size={16} />}
                                        onClick={addAllUsers}
                                        disabled={users.length >= maxUsers}
                                    >
                                        Add All Users
                                    </Button>
                                )}
                            </Group>
                        )}
                    </Stack>

                    <Flex align="center" justify="end" mt={16}>
                        <Button
                            variant="light"
                            onClick={() => closeModal("viewDocumentReview")}
                        >
                            {allUsersDecided ? "Close" : "Cancel"}
                        </Button>

                        {!allUsersDecided && (
                            <>
                                <Button
                                    ml={12}
                                    type="submit"
                                    loading={processing}
                                >
                                    Update
                                </Button>

                                <ActionIcon
                                    variant="transparent"
                                    color="red"
                                    onClick={() => {
                                        closeModal("viewDocumentReview");
                                        openModal(
                                            "confirmDeleteDocumentReview"
                                        );
                                    }}
                                    title="Delete Document Approval"
                                    ml={12}
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </>
                        )}
                    </Flex>
                </form>
            </Modal>
            <ConfirmDeleteDocumentReviewForm
                documentReviewId={documentApprovalId}
            />
        </>
    );
};

export default ViewDocumentReviewForm;
