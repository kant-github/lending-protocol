import { ButtonHTMLAttributes, JSX, ReactNode } from "react";

type Variant = "default" | "primary";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    children?: ReactNode;
}

const base: Record<Variant, string> = {
    default: "border-neutral-300 bg-[#e4e4e7]",
    primary: "border-neutral-950 bg-neutral-950",
};

const cap: Record<Variant, string> = {
    default: "bg-white text-neutral-900 group-hover:bg-neutral-50",
    primary: "bg-neutral-800 text-white group-hover:bg-neutral-700",
};

const sizes: Record<Size, string> = {
    sm: "px-3 py-2 text-[12px]",
    md: "px-5 py-2.5 text-sm",
};

function cn(...parts: (string | false | undefined)[]): string {
    return parts.filter(Boolean).join(" ");
}

export default function Button({
    variant = "default",
    size = "sm",
    children,
    className,
    disabled,
    ...props
}: ButtonProps): JSX.Element {
    return (
        <button
            disabled={disabled}
            className={cn(
                "group rounded-lg border pb-1 transition-all duration-100",
                base[variant],
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer active:pb-0 active:translate-y-1",
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    "flex items-center justify-center gap-1.5 rounded-[7px] font-medium transition-colors duration-100",
                    cap[variant],
                    sizes[size],
                )}
            >
                {children}
            </span>
        </button>
    );
}
