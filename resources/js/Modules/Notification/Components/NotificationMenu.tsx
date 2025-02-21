import React, { useEffect, useState } from 'react';
import { ActionIcon, Badge, Group, Menu, Text, ScrollArea, Avatar, Indicator, Stack, Divider } from '@mantine/core';
import { IconBell, IconFileTypePdf, IconDownload } from '@tabler/icons-react';
import { DocumentApprovalResourceData } from '@/Modules/DocumentApproval/Types/DocumentApprovalResourceData';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { ItemIcon } from "@/Modules/Common/Components/ItemIcon/ItemIcon";

interface NotificationMenuProps {
    notifications?: DocumentApprovalResourceData[];
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({ notifications }) => {
    return (
        <Menu
            width={300}
            position="bottom-end"
            shadow="md"
        >
            <Menu.Target>
                <Indicator
                    processing
                    inline
                    disabled={notifications?.length === 0}
                    color="red"
                >
                    <ActionIcon variant="subtle" color="gray" size="lg">
                        <IconBell size={24} />
                    </ActionIcon>
                </Indicator>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Pending Approvals</Menu.Label>
                {notifications?.length === 0 ? (
                    <Menu.Item disabled>No pending approvals.</Menu.Item>
                ) : (
                    <ScrollArea style={{ height: 200 }}>
                        {notifications?.map(notification => (
                            <React.Fragment key={notification.id}>
                                <Menu.Item py={16} key={notification.id} component={Link} href={`/document_approval/${notification.id}`}>
                                    <Group gap={12}>
                                        <ItemIcon mime={"application/pdf"} isFolder={false} />
                                        <Text size="sm">{notification.document_name.slice(0, 20) + "..."}</Text>
                                    </Group>
                                </Menu.Item>

                                <Divider />
                            </React.Fragment>
                        ))}
                    </ScrollArea>
                )}

                <Menu.Divider />

                <Menu.Item component={Link} href={route('notification.index')}>
                    View All Notifications
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default NotificationMenu;
