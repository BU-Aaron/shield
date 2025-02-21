import { Link, InertiaLinkProps } from "@inertiajs/react";
import styles from "./ResponsiveNavLink.module.css";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`${styles.link} ${
                active ? styles.active : styles.inactive
            } ${className}`}
        >
            {children}
        </Link>
    );
}
