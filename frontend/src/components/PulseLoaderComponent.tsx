import { PulseLoader } from "react-spinners";

const PulseLoaderComponent = ({
    size,
    color,
}: {
    size: number;
    color?: string;
}) => {
    return (
        <PulseLoader
            color={color ? color : "#232D3F"}
            size={size ? size : 15}
        />
    );
};

export default PulseLoaderComponent;
