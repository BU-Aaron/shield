import { useState } from "react";
import { Head } from "@inertiajs/react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Button, Flex, Group, rem, Stack, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Authenticated } from "@/Modules/Common/Layouts/AuthenticatedLayout/Authenticated";
import AddUserForm from "@/Modules/User/Forms/AddUserForm";
import UpdateUserForm from "@/Modules/User/Forms/UpdateUserForm";
import DeleteUserForm from "@/Modules/User/Forms/DeleteUserForm";
import UserTable from "@/Modules/User/Components/UserTable";
import { useSearchDataTable } from "@/Modules/Common/Hooks/use-search-datatable";
import { usePaginateDataTable } from "@/Modules/Common/Hooks/use-paginate-datatable";
import { UserResourceData } from "@/Modules/User/Types/UserResourceData";
import { PaginationData, Filters } from "@/Modules/User/Types/UserPageTypes";
interface IProps {
    users: PaginationData;
    filters: Filters;
}

export default function UserPage({ users, filters }: IProps) {
    const [selectedRecord, setSelectedRecord] = useState<UserResourceData[]>([]);
    const [currentUser, setCurrentUser] = useState<UserResourceData>();

    const { search, setSearch, handleSearch } = useSearchDataTable(filters.search || "", "/users");
    const { page, setPage, handlePageChange } = usePaginateDataTable(users.current_page);

    const [addUserOpened, { open: openAddUser, close: closeAddUser }] = useDisclosure(false);
    const [editUserOpened, { open: openEditUser, close: closeEditUser }] = useDisclosure(false);
    const [deleteUserOpened, { open: openDeleteUser, close: closeDeleteUser }] = useDisclosure(false);

    const handleEditUser = (user: UserResourceData) => {
        setCurrentUser(user);
        openEditUser();
    };

    const handleDeleteUser = (user: UserResourceData) => {
        setCurrentUser(user);
        openDeleteUser();
    };

    return (
        <Authenticated>
            <Head title="User" />
            <Stack px={8} gap={24} py={8}>
                <Text component="h2" size="xl" fw={600} c="gray.8">
                    User
                </Text>
                <Flex
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 12, md: 0 }}
                >
                    <TextInput
                        w={{ md: 400 }}
                        placeholder="Search"
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearch(e.target.value);
                        }}
                    />
                    <Button leftSection={<IconPlus size={14} />} onClick={openAddUser}>
                        Add New User
                    </Button>
                </Flex>
                <UserTable
                    users={users.data}
                    total={users.total}
                    perPage={users.per_page}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p);
                        handlePageChange(p, users.links);
                    }}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    selectedRecords={selectedRecord}
                    onSelectedRecordsChange={setSelectedRecord}
                />
            </Stack>

            <AddUserForm isOpened={addUserOpened} close={closeAddUser} />

            <UpdateUserForm isOpened={editUserOpened} close={closeEditUser} user={currentUser} />

            <DeleteUserForm isOpened={deleteUserOpened} close={closeDeleteUser} user={currentUser} />
        </Authenticated>
    );
}