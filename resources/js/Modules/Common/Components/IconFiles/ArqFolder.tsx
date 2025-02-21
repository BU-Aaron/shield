import { SVGAttributes } from "react";

interface ArqFolderProps extends SVGAttributes<SVGElement> {
    size?: number;
}

const ArqFolder = ({ size = 200, ...props }: ArqFolderProps) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 544 544" fill="none">
            <path d="M16 98.5602V444.948C16 459.752 28.0016 471.754 42.8063 471.754H501.194C515.998 471.754 528 459.752 528 444.948V153.227C528 138.422 515.998 126.421 501.194 126.421H260.603C250.182 126.421 240.743 120.338 235.291 111.456C225.357 95.2712 207.444 71.7539 187.225 71.7539H42.7644C27.9597 71.7539 16 83.7555 16 98.5602Z" fill="#FFC531" />
            <path d="M528 163.561V435.948C528 450.752 515.998 462.754 501.194 462.754H42.8063C28.0016 462.754 16 450.752 16 435.948V190.699C16 175.895 27.962 163.893 42.7667 163.893H178.178C223.749 163.893 217.382 136.752 248.544 136.754C333.567 136.758 449.546 136.756 501.239 136.755C516.044 136.754 528 148.756 528 163.561Z" fill="url(#paint0_linear_42_2038)" />
            <defs>
                <linearGradient id="paint0_linear_42_2038" x1="528" y1="136.754" x2="27.1538" y2="479.073" gradientUnits="userSpaceOnUse">
                    <stop offset="1" stopColor="#FFD93F" />
                </linearGradient>
            </defs>
        </svg>
    )
};

export default ArqFolder;