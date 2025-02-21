import { Link, InertiaLinkProps } from "@inertiajs/react";
import styles from "./NavLink.module.css";
import { Anchor } from "@mantine/core";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    const classes = `${styles.navLink} ${
        active ? styles.active : styles.default
    } ${className}`;

    return (
        <Anchor
            {...props}
            size="sm"
            component={Link}
            className={styles.mainLink}
            data-active={active ? "true" : undefined}
        >
            {children}
        </Anchor>
    );
}
